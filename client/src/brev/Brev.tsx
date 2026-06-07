import { Button, InfoCard, Loader, LocalAlert, VStack } from '@navikt/ds-react'
import { useMemo, useState } from 'react'

import { PanelTittel } from '../felleskomponenter/panel/PanelTittel.tsx'
import { Tekst, TextContainer } from '../felleskomponenter/typografi.tsx'
import { Oppgavestatus, type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import {
  type Behandling,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallVedtak,
  VedtaksResultat,
} from '../sak/v2/behandling/behandlingTyper.ts'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { useClosePanel } from '../sak/v2/paneler/usePanelHooks.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { formaterDatoLang } from '../utils/dato.ts'
import './Brev.less'
import classes from './Brev.module.css'
import { BrevContext } from './BrevContext.ts'
import { Breveditor, BreveditorState } from './breveditor/Breveditor.tsx'
import { PlaceholderFeil, validerPlaceholders } from './breveditor/plugins/placeholder/PlaceholderFeil.ts'
import { BrevForhåndsvisning } from './BrevForhåndsvisning.tsx'
import { BrevmalLaster } from './brevmaler/BrevmalLaster.tsx'
import { Brevstatus, Brev as BrevType } from './brevTyper.ts'
import { SlettBrevModal } from './SlettBrevModal.tsx'
import { useBrev } from './useBrev.ts'
import { useBrevActions } from './useBrevActions.ts'

export interface BrevProps {
  oppgave?: Saksbehandlingsoppgave
  brevId?: string
}

export function Brev({ oppgave, brevId }: BrevProps) {
  const { sak } = useSak()
  const closePanel = useClosePanel('brevpanel')
  const [visSlettBrevModal, setVisSlettBrevModal] = useState(false)

  const { brev, isLoading: brevIsLoading, error: brevError } = useBrev<BreveditorState>(brevId)

  const { gjeldendeBehandling } = useBehandling()
  const oppgaveFerdigstilt = oppgave?.oppgavestatus === Oppgavestatus.FERDIGSTILT

  const [placeholderFeil, setPlaceholderFeil] = useState<PlaceholderFeil[]>([])
  const [synligKryssKnapp, setSynligKryssKnapp] = useState(false)

  const datoSoknadMottatt = sak?.data.opprettet
  const hjelpemidlerSøktOm = sak?.data.søknadGjelder
    ? sak.data.søknadGjelder
        .replace(/^Søknad om:\s*/i, '')
        .split(',')
        .map((h) => h.trim())
    : undefined

  const { oppdaterBrevutkast, slettBrevutkast, ferdigstillBrevutkast, redigerBrevutkast } = useBrevActions(
    oppgave,
    brev?.brevId
  )

  const [valgtMal, velgMal] = useState<string>()
  const errorEr404 = useMemo(() => brev?.data?.value == null, [brev?.data])
  const brevSendt = useMemo(() => brev?.status == Brevstatus.DISTRIBUERT, [brev]) // fixme

  const malKey = utledMalKey(gjeldendeBehandling, brev)

  /* fixme
  const [prevBrevutkastValue, setPrevBrevutkastValue] = useState(brev?.data?.value)
  const currentValue = brev?.data?.value
  // todo -> vi bør vel ikke endre state rett i render
  if (currentValue !== prevBrevutkastValue) {
    setPrevBrevutkastValue(currentValue)
    if (currentValue) {
      velgMal(undefined)
      setOpprettBrevKlikket('')
      mutateGjeldendeBehandling()
      // mutateBrevMetadata()
    }
  }
  */

  if (brevIsLoading) {
    return (
      <div className={classes.loaderContainer}>
        <Loader title="Laster inn brevutkast..." />
      </div>
    )
  } else if (brevError) {
    return (
      <div className={classes.loaderContainer}>
        <LocalAlert status="warning">
          <LocalAlert.Title>Feil med lagring av utkast</LocalAlert.Title>
          <LocalAlert.Content>
            Får ikke kontakt med tjeneren, brev ikke tilgjengelig. Prøv igjen senere.
          </LocalAlert.Content>
        </LocalAlert>
      </div>
    )
  }

  const handleLagreBrev = async (state: BreveditorState) => {
    if (!brev) return // Utkast må være opprettet først
    await oppdaterBrevutkast.trigger({
      brevutkast: {
        brevmal: brev.brevmal,
        brevmalVersjon: brev.brevmalVersjon,
        målform: brev.målform,
        data: state,
      },
    })
  }

  const handleSlettBrevutkast = async () => {
    if (!brev) return
    await slettBrevutkast.trigger()
    closePanel()
  }

  const markerKlart = async (klart: boolean) => {
    setSynligKryssKnapp(true)
    const currentBrev = brev?.data?.value
    if (!currentBrev) return

    const feil = validerPlaceholders(currentBrev)
    if (feil.length > 0) {
      setPlaceholderFeil(feil)
      return
    }
    setPlaceholderFeil([])
    if (klart) {
      await ferdigstillBrevutkast.trigger()
    } else {
      await redigerBrevutkast.trigger()
    }
  }

  return (
    <BrevContext
      value={{
        placeholderFeil,
        setPlaceholderFeil,
        synligKryssKnapp,
        setSynligKryssKnapp,
        datoSoknadMottatt,
        hjelpemidlerSøktOm,
      }}
    >
      {brevSendt && (
        <>
          <div className={classes.panelHeader}>
            <PanelTittel tittel="Vedtaksbrev" lukkPanel={closePanel} />
          </div>
          <BrevForhåndsvisning brevId={brev?.brevId} />
        </>
      )}
      {errorEr404 && valgtMal == null && malKey == null && !brevSendt && (
        <VStack paddingInline="space-20" gap="space-16">
          <PanelTittel
            paddingInline="space-8 space-0"
            tittel="Brev"
            lukkPanel={() => {
              closePanel()
            }}
          />
          <TextContainer>
            <InfoCard data-color="info" size="small">
              <InfoCard.Header>
                <InfoCard.Title>Ingen mal valgt for brevutkast</InfoCard.Title>
              </InfoCard.Header>
              <InfoCard.Content>
                <Tekst>
                  I fremtiden vil man kunne opprette brev underveis i saken her. Foreløpig må du sette et
                  vedtaksresultat i behandlingspanelet og velge om du vil opprette vedtaksbrev der.
                </Tekst>
              </InfoCard.Content>
            </InfoCard>
          </TextContainer>
        </VStack>
      )}
      {errorEr404 && valgtMal == null && malKey != null && !brevSendt && (
        <BrevmalLaster malKey={malKey} velgMal={velgMal} />
      )}
      {(!errorEr404 || valgtMal != null) && brev?.data && !brevSendt && (
        <div className="brev">
          {oppgaveFerdigstilt && !brev?.data?.ferdigstilt && (
            <>
              <VStack paddingInline="space-20" gap="space-16">
                <PanelTittel
                  paddingInline="space-8 space-0"
                  tittel="Brev"
                  lukkPanel={() => {
                    closePanel()
                  }}
                />
                <TextContainer>
                  <InfoCard data-color="info" size="small">
                    <InfoCard.Header>
                      <InfoCard.Title>Oppgaven er ferdigstilt</InfoCard.Title>
                    </InfoCard.Header>
                    <InfoCard.Content>
                      <Tekst>
                        Denne oppgaven er ferdigstilt. Du kan ikke lenger redigere brevet. Dersom du har angret på
                        vedtaket finnes det en ny oppgave i din liste hvor du kan redigere brevet som tidligere var
                        tilknyttet denne oppgaven.
                      </Tekst>
                    </InfoCard.Content>
                  </InfoCard>
                </TextContainer>
              </VStack>
            </>
          )}
          {!oppgaveFerdigstilt && !brev?.ferdigstilt && (
            <>
              <div className="brevtoolbar">
                <div className="left">
                  <Button variant="tertiary" size="small" onClick={() => setVisSlettBrevModal(true)}>
                    Slett utkast
                  </Button>
                </div>
                <div className="right">
                  <Button
                    loading={ferdigstillBrevutkast.isMutating}
                    variant="primary"
                    size="small"
                    onClick={() => markerKlart(true)}
                  >
                    Ferdigstill utkast
                  </Button>
                </div>
              </div>
              <Breveditor
                placeholder="Skriv et fantastisk brev her..."
                metadata={{
                  brukersNavn: sak?.data.bruker.fulltNavn || '',
                  brukersFødselsnummer: sak?.data.bruker.fnr || '',
                  saksnummer: Number(sak!.data.sakId),
                  brevOpprettet: formaterDatoLang(new Date().toISOString()),
                  saksbehandlerNavn: oppgave?.tildeltSaksbehandler?.navn || '',
                  attestantsNavn: undefined,
                  hjelpemiddelsentral: sak?.data.enhet.navn || 'Nav hjelpemiddelsentral',
                }}
                brevId={sak!.data.sakId.toString()}
                templateMarkdown={valgtMal}
                initialState={brev?.data}
                onLagreBrev={handleLagreBrev}
              />
            </>
          )}
          {brev?.ferdigstilt && (
            <>
              {!oppgaveFerdigstilt && (
                <>
                  <div className="brevtoolbar">
                    <div className="left"></div>
                    <div className="right">
                      <Button variant="tertiary" size="small" onClick={() => markerKlart(false)}>
                        Rediger
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {oppgaveFerdigstilt && (
                <div className={classes.panelHeader}>
                  <PanelTittel tittel="Vedtaksbrev" lukkPanel={closePanel} />
                </div>
              )}
              <BrevForhåndsvisning brevId={brevId} />
            </>
          )}
        </div>
      )}
      <SlettBrevModal
        heading="Vil du slette brevutkastet?"
        tekst="Du er i ferd med å slette brevutkastet. Dette kan ikke angres."
        width="700px"
        loading={slettBrevutkast.isMutating}
        open={visSlettBrevModal}
        onClose={() => setVisSlettBrevModal(false)}
        onBekreft={handleSlettBrevutkast}
      />
    </BrevContext>
  )
}

function utledMalKey(behandling?: Behandling, brev?: BrevType<BreveditorState>): string | undefined {
  if (!brev || brev?.data.value) return

  const utfall = behandling?.utfall

  if (isBehandlingsutfallVedtak(utfall)) {
    switch (utfall.utfall) {
      case VedtaksResultat.INNVILGET:
        return 'innvilgelse'
      case VedtaksResultat.DELVIS_INNVILGET:
        return 'delvis-innvilgelse-bruker-har-ikke-rett'
      case VedtaksResultat.AVSLÅTT:
        return 'avslag-bruker-har-ikke-rett'
      default:
        return
    }
  }

  if (isBehandlingsutfallHenleggelse(utfall)) {
    return 'henleggelse'
  }

  return
}
