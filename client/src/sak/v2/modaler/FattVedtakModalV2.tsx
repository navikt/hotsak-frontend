import { Alert, InfoCard, VStack } from '@navikt/ds-react'
import { useRef, useState } from 'react'

import { useBrevMetadata } from '../../../brev/useBrevMetadata'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { Tekst } from '../../../felleskomponenter/typografi'
import { BekreftelseModal } from '../../../saksbilde/komponenter/BekreftelseModal'
import { Sak } from '../../../types/types.internal'
import { assertNever } from '../../../utils/type'
import { VedtakFormValues } from '../../felles/useVedtak'
import { VedtakForm, VedtakFormHandle } from '../../felles/VedtakForm'
import { VedtaksResultat } from '../behandling/behandlingTyper'
import { useBehandlingActions } from '../behandling/useBehandlingActions'
import { useClosePanel } from '../paneler/usePanelHooks'

export interface FattVedtakModalV2Props {
  open: boolean
  onClose(): void
  sak: Sak
  vedtaksresultat: VedtaksResultat
}

export function FattVedtakModalV2({ open, onClose, sak, vedtaksresultat }: FattVedtakModalV2Props) {
  const [vedtakLoader, setVedtakLoader] = useState(false)
  const { ferdigstillBehandling } = useBehandlingActions()
  const { showSuccessToast } = useToast()
  const formRef = useRef<VedtakFormHandle>(null)
  const closePanel = useClosePanel('brevpanel')

  const erAvslag = vedtaksresultat === VedtaksResultat.AVSLÅTT
  const erDelvisInnvilget = vedtaksresultat === VedtaksResultat.DELVIS_INNVILGET
  const erInnvilget = vedtaksresultat === VedtaksResultat.INNVILGET
  const brevMetaData = useBrevMetadata()

  const fattVedtak = async (data: VedtakFormValues) => {
    setVedtakLoader(true)

    if (erInnvilget) {
      await ferdigstillBehandling({
        problemsammendrag: data.problemsammendrag,
        postbegrunnelse: data.postbegrunnelse,
        utleveringMerknad: data.utleveringMerknad,
      })
    } else if (erDelvisInnvilget) {
      await ferdigstillBehandling({
        problemsammendrag: data.problemsammendrag,
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
    setVedtakLoader(true)
    await ferdigstillBehandling({})

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
      onBekreft={erAvslag ? fattAvslagsvedtak : () => formRef.current?.submit()}
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
    </BekreftelseModal>
  )
}
