import { Alert, InfoCard, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'

import { useBrevMetadata } from '../../../brev/useBrevMetadata'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { Tekst } from '../../../felleskomponenter/typografi'
import { usePerson } from '../../../personoversikt/usePerson'
import { BekreftelseModal } from '../../../saksbilde/komponenter/BekreftelseModal'
import { Brevmottaker, Sak } from '../../../types/types.internal'
import { assertNever } from '../../../utils/type'
import { VedtakFormValues } from '../../felles/useVedtak'
import { VedtakForm, VedtakFormHandle } from '../../felles/VedtakForm'
import { VedtaksResultat } from '../behandling/behandlingTyper'
import { useBehandlingActions } from '../behandling/useBehandlingActions'
import { BrevTilBrukerEllerVerge } from '../BrevTilBrukerEllerVerge'
import { useClosePanel } from '../paneler/usePanelHooks'
import { useMiljø } from '../../../utils/useMiljø'

export interface FattVedtakModalV2Props {
  open: boolean
  onClose(): void
  sak: Sak
  vedtaksresultat: VedtaksResultat
}

export function FattVedtakModalV2({ open, onClose, sak, vedtaksresultat }: FattVedtakModalV2Props) {
  const { erDev } = useMiljø()
  const [vedtakLoader, setVedtakLoader] = useState(false)
  const { ferdigstillBehandling } = useBehandlingActions()
  const { showSuccessToast } = useToast()
  const formRef = useRef<VedtakFormHandle>(null)
  const closePanel = useClosePanel('brevpanel')

  const erAvslag = vedtaksresultat === VedtaksResultat.AVSLÅTT
  const erDelvisInnvilget = vedtaksresultat === VedtaksResultat.DELVIS_INNVILGET
  const erInnvilget = vedtaksresultat === VedtaksResultat.INNVILGET
  const brevMetaData = useBrevMetadata()
  const { personInfo } = usePerson(sak.bruker.fnr)
  const harVergePåHjelpemiddelområdet = !!(
    personInfo?.vergemål?.some((vergemål) =>
      vergemål.vergeEllerFullmektig.tjenesteomraade?.some((tjeneste) => tjeneste.tjenesteoppgave === 'hjelpemidler')
    ) &&
    brevMetaData.harBrevISak &&
    erDev
  )
  const [brevMottaker, setBrevMottaker] = useState<Brevmottaker | undefined>(undefined)
  const [vergeError, setVergeError] = useState<string | undefined>(undefined)

  const fattVedtak = async (data: VedtakFormValues) => {
    if (harVergePåHjelpemiddelområdet && brevMottaker === undefined) {
      return
    }
    setVedtakLoader(true)

    if (erInnvilget) {
      await ferdigstillBehandling({
        problemsammendrag: data.problemsammendrag,
        postbegrunnelse: data.postbegrunnelse,
        utleveringMerknad: data.utleveringMerknad,
        brevMottaker: brevMottaker ? new Set([brevMottaker]) : undefined,
      })
    } else if (erDelvisInnvilget) {
      await ferdigstillBehandling({
        problemsammendrag: data.problemsammendrag,
        brevMottaker: brevMottaker ? new Set([brevMottaker]) : undefined,
      })
    }
    if (erInnvilget) {
      // lukker brevpanelet hvis det er åpent og det ikke finnes et brev og det innvilges
      if (!brevMetaData.harBrevISak) closePanel()
    }
    setVedtakLoader(false)
    showSuccessToast('Vedtak fattet')
    onClose()
  }

  const fattAvslagsvedtak = async () => {
    if (harVergePåHjelpemiddelområdet && brevMottaker === undefined) {
      setVergeError('Du må velge om brevet skal sendes til bruker eller verge')
      return
    }
    setVedtakLoader(true)
    await ferdigstillBehandling({ brevMottaker: brevMottaker ? new Set([brevMottaker]) : undefined })

    setVedtakLoader(false)
    showSuccessToast('Vedtak fattet')
    onClose()
  }

  const vedtakTekst = (() => {
    switch (vedtaksresultat) {
      case VedtaksResultat.INNVILGET:
        return { verb: 'innvilge', knapp: 'Innvilg' }
      case VedtaksResultat.DELVIS_INNVILGET:
        return { verb: 'delvis innvilge', knapp: 'Delvis innvilg' }
      case VedtaksResultat.AVSLÅTT:
        return { verb: 'avslå', knapp: 'Avslå' }
      default:
        return assertNever(vedtaksresultat)
    }
  })()

  return (
    <BekreftelseModal
      heading={`Vil du ${vedtakTekst?.verb} søknaden?`}
      loading={vedtakLoader}
      open={open}
      width="700px"
      buttonSize="medium"
      bekreftButtonLabel={`${vedtakTekst?.knapp}${brevMetaData.harBrevISak ? ' og send brev' : ''}`}
      onBekreft={
        erAvslag
          ? fattAvslagsvedtak
          : () => {
              if (harVergePåHjelpemiddelområdet && brevMottaker === undefined) {
                setVergeError('Du må velge om brevet skal sendes til bruker eller verge')
              }
              formRef.current?.submit()
            }
      }
      onClose={onClose}
    >
      {(erInnvilget || erDelvisInnvilget) && (
        <VStack gap="space-16">
          {erDelvisInnvilget && (
            <InfoCard data-color="warning" size="small">
              <InfoCard.Header>
                <InfoCard.Title>Du må legge til hjelpemidlene manuelt i OeBS</InfoCard.Title>
              </InfoCard.Header>
              <InfoCard.Content>
                <Tekst>
                  Når du delvis innvilger må du huske å redigere hjepemidlene i serviceforespørselen i OeBS før du
                  oppretter ordre.
                </Tekst>
              </InfoCard.Content>
            </InfoCard>
          )}
          {brevMetaData.harBrevISak && (
            <InfoCard data-color="info" size="small">
              <InfoCard.Header>
                <InfoCard.Title>Du er i ferd med å sende ut et brev</InfoCard.Title>
              </InfoCard.Header>
              <InfoCard.Content>
                <Tekst>Brevet vil bli sendt ut neste virkedag. Innbygger vil da få varsel om vedtaksresultatet.</Tekst>
              </InfoCard.Content>
            </InfoCard>
          )}
          <Tekst spacing>
            {`Når du går videre blir det opprettet en serviceforespørsel (SF) i OeBS.
            ${!brevMetaData.harBrevISak ? ' Innbygger får varsel om vedtaksresultatet neste virkedag.' : ''}`}
          </Tekst>

          {(erInnvilget || erDelvisInnvilget) && (
            <VedtakForm
              sak={sak}
              ref={formRef}
              onVedtak={fattVedtak}
              postbegrunnelsePåkrevd={erInnvilget}
              vedtaksresultat={vedtaksresultat}
            />
          )}
        </VStack>
      )}
      {erAvslag && (
        <>
          <Alert variant="info" size="small" style={{ marginBottom: '1em' }}>
            Du er i ferd med å sende ut et brev til bruker. Brevet vil bli sendt ut neste virkedag. Innbygger vil da få
            varsel om vedtaksresultatet.
          </Alert>
        </>
      )}
      {harVergePåHjelpemiddelområdet && personInfo && (
        <BrevTilBrukerEllerVerge
          person={personInfo}
          value={brevMottaker}
          onChange={(value) => {
            setBrevMottaker(value)
            setVergeError(undefined)
          }}
          error={vergeError}
        />
      )}
    </BekreftelseModal>
  )
}
