import { Button, HStack, InfoCard, Loader, LocalAlert } from '@navikt/ds-react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { PanelTittel } from '../felleskomponenter/panel/PanelTittel.tsx'
import { Etikett, Tekst, TextContainer } from '../felleskomponenter/typografi.tsx'
import { Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { VedtaksResultat } from '../sak/v2/behandling/behandlingTyper.ts'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { useClosePanel, useSakContext } from '../sak/v2/SakProvider.tsx'
import { useBrev } from '../saksbilde/barnebriller/steg/vedtak/brev/useBrev.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { Brevtype, RessursStatus } from '../types/types.internal.ts'
import { formaterDatoLang } from '../utils/dato.ts'
import './Brev.less'
import Breveditor, { StateMangement } from './breveditor/Breveditor.tsx'
import { PlaceholderFeil, validerPlaceholders } from './breveditor/plugins/placeholder/PlaceholderFeil.ts'
import { BrevmalLaster } from './brevmaler/BrevmalLaster.tsx'
import { useBrevMetadata } from './useBrevMetadata.ts'

interface BrevContextType {
  placeholderFeil: PlaceholderFeil[]
  setPlaceholderFeil: (feil: PlaceholderFeil[]) => void
  synligKryssKnapp: boolean
  setSynligKryssKnapp: (synlig: boolean) => void
}

const BrevContext = createContext<BrevContextType | undefined>(undefined)

export const useBrevContext = () => {
  const ctx = useContext(BrevContext)
  if (!ctx) throw new Error('useBrevContext must be used within BrevContextProvider')
  return ctx
}

export const Brev = () => {
  const { sak } = useSak()
  const { opprettBrevKlikket, setOpprettBrevKlikket } = useSakContext()
  const closePanel = useClosePanel('brevpanel')

  const { gjeldendeBehandling, mutate: mutateGjeldendeBehandling } = useBehandling()
  const { oppgave } = useOppgave()
  const { mutate: mutateBrevMetadata } = useBrevMetadata()
  const oppgaveFerdigstilt = oppgave?.oppgavestatus === Oppgavestatus.FERDIGSTILT

  const [placeholderFeil, setPlaceholderFeil] = useState<PlaceholderFeil[]>([])
  const [synligKryssKnapp, setSynligKryssKnapp] = useState(true)

  const vedtaksResultat = gjeldendeBehandling?.utfall?.utfall

  const brevutkast = useSWR<
    {
      error?: string
      data?: StateMangement
      ferdigstilt: boolean
      opprettet: string
    },
    Error
  >(`/api/sak/${sak!.data.sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, async (key: string) =>
    fetch(key, { method: 'get' }).then((res) => res.json())
  )

  const [valgtMal, velgMal] = useState<string>()
  const errorEr404 = useMemo(() => brevutkast.data?.data?.value == undefined, [brevutkast.data])

  const malKey =
    errorEr404 && opprettBrevKlikket
      ? vedtaksResultat === VedtaksResultat.INNVILGET
        ? 'innvilgelse'
        : vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET
          ? 'delvis-innvilgelse-bruker-har-ikke-rett'
          : vedtaksResultat === VedtaksResultat.AVSLÅTT
            ? 'avslag-bruker-har-ikke-rett'
            : undefined
      : undefined

  useEffect(() => {
    // Når backend er oppdatert med state fjerner vi mal-valget slik at vi ikke ender opp i en loop
    if (brevutkast.data?.data?.value) {
      velgMal(undefined)
      setOpprettBrevKlikket(false)
      mutateGjeldendeBehandling()
      mutateBrevMetadata()
    }
  }, [brevutkast.data, setOpprettBrevKlikket, mutateGjeldendeBehandling])

  const { nullstillBrev: nullstillForhåndsvisning, hentForhåndsvisning, hentedeBrev } = useBrev()

  useEffect(() => {
    if (brevutkast.data?.ferdigstilt) {
      if (hentedeBrev[Brevtype.BREVEDITOR_VEDTAKSBREV]?.status == RessursStatus.IKKE_HENTET) {
        if (sak?.data.sakId) hentForhåndsvisning(sak.data.sakId, Brevtype.BREVEDITOR_VEDTAKSBREV)
      }
    } else {
      if (hentedeBrev[Brevtype.BREVEDITOR_VEDTAKSBREV]?.status != RessursStatus.IKKE_HENTET) {
        nullstillForhåndsvisning(Brevtype.BREVEDITOR_VEDTAKSBREV)
      }
    }
  }, [brevutkast.data?.ferdigstilt, hentedeBrev, sak?.data.sakId, hentForhåndsvisning, nullstillForhåndsvisning])

  if (brevutkast.isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '2em' }}>
        <Loader title="Laster inn brevutkast..." />
      </div>
    )
  } else if (brevutkast.error) {
    return (
      <div style={{ textAlign: 'center', padding: '2em' }}>
        <LocalAlert status="warning">
          <LocalAlert.Title>Feil med lagring av utkast</LocalAlert.Title>
          <LocalAlert.Content>
            Får ikke kontakt med tjeneren, brev ikke tilgjengelig. Prøv igjen senere.
          </LocalAlert.Content>
        </LocalAlert>
      </div>
    )
  }

  const lagreBrevutkast = async (data: any) => {
    return fetch(`/api/sak/${sak!.data.sakId}/brevutkast`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({
        brevtype: 'BREVEDITOR_VEDTAKSBREV',
        målform: 'BOKMÅL',
        data: data,
      }),
    }).then((res) => {
      if (brevutkast.data) {
        // Ingen lokal mutate her siden et av de mulige resultatene her er at brevet merkes som ferdig og endrer viewet
        // til en forhåndsvisning av de lagrede dataene som PDF
        brevutkast.mutate()
      }
      return res
    })
  }

  const onSlettBrev = async () => {
    velgMal(undefined) // Unngå at forrige valgte mal trigger at breveditoren laster den på nytt
    await fetch(`/api/sak/${sak!.data.sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, {
      method: 'delete',
    }).then((res) => {
      if (!res.ok) throw new Error(`Brev ikke slettet, statuskode ${res.status}`)
    })
    closePanel()
    await brevutkast.mutate()
    mutateGjeldendeBehandling()
    mutateBrevMetadata()
  }

  const markerKlart = async (klart: boolean) => {
    const currentBrev = brevutkast.data?.data?.value
    if (!currentBrev) return

    const feil = validerPlaceholders(currentBrev)
    if (feil.length > 0) {
      setPlaceholderFeil(feil)
      return
    }
    setPlaceholderFeil([])
    await fetch(`/api/sak/${sak!.data.sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV/ferdigstilling`, {
      method: klart ? 'post' : 'delete',
    })
    brevutkast.mutate()

    await mutateGjeldendeBehandling()
    await mutateBrevMetadata()
    if (klart) {
      if (sak?.data.sakId) hentForhåndsvisning(sak.data.sakId, Brevtype.BREVEDITOR_VEDTAKSBREV)
    }
  }

  return (
    <BrevContext.Provider
      value={{
        placeholderFeil,
        setPlaceholderFeil,
        synligKryssKnapp,
        setSynligKryssKnapp,
      }}
    >
      {errorEr404 && valgtMal === undefined && malKey === undefined && (
        <div style={{ padding: '1em' }}>
          <TextContainer>
            <InfoCard data-color="info" size="small">
              <InfoCard.Header>
                <InfoCard.Title>Ingen mal valgt for brevutkast</InfoCard.Title>
              </InfoCard.Header>
              <InfoCard.Content>
                <Tekst>
                  I fremtiden vil man kunne opprette brev underveis i saken her. For nå må du sette et vedtaksresultat i
                  behandlingspanelet og velge om du vil opprette vedtaksbrev der.
                </Tekst>
              </InfoCard.Content>
            </InfoCard>
          </TextContainer>
        </div>
      )}
      {errorEr404 && valgtMal === undefined && malKey !== undefined && (
        <BrevmalLaster malKey={malKey} velgMal={velgMal} />
      )}
      {(!errorEr404 || valgtMal !== undefined) && brevutkast.data && (
        <div className="brev">
          {!brevutkast.data?.ferdigstilt && (
            <>
              <div className="brevtoolbar">
                <div className="left">
                  <Button variant="tertiary" size="small" onClick={() => onSlettBrev()}>
                    Slett utkast
                  </Button>
                </div>
                <div className="right">
                  <Button
                    loading={brevutkast.isLoading || brevutkast.isValidating}
                    variant="secondary"
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
                  brevOpprettet: formaterDatoLang(brevutkast.data?.opprettet), // TODO: Skal brev opprettet settes til utsendelsesdato? Eller dagen brevet ble skrevet og ferdigstilt?
                  saksbehandlerNavn: sak?.data.saksbehandler?.navn || '',
                  attestantsNavn: undefined,
                  hjelpemiddelsentral: sak?.data.enhet.enhetsnavn || 'Nav hjelpemiddelsentral',
                }}
                brevId={sak!.data.sakId.toString()}
                templateMarkdown={valgtMal}
                initialState={brevutkast.data?.data}
                onLagreBrev={async (state) => {
                  await lagreBrevutkast(state).then((res) => {
                    if (!res.ok) throw new Error(`Brev ikke lagret, statuskode ${res.status}`)
                  })
                }}
                onSlettBrev={onSlettBrev}
              />
            </>
          )}
          {brevutkast.data?.ferdigstilt && (
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
                <div style={{ padding: '0.8em 1em' }}>
                  <PanelTittel tittel="Vedtaksbrev" lukkPanel={closePanel} />
                </div>
              )}
              {hentedeBrev[Brevtype.BREVEDITOR_VEDTAKSBREV]?.status == RessursStatus.HENTER && (
                <HStack justify="center" gap="space-16" marginBlock="space-16">
                  <Loader size="medium" title="Henter brev..." />
                  <Etikett>Genererer forhåndsvisning av brev...</Etikett>
                </HStack>
              )}
              {hentedeBrev[Brevtype.BREVEDITOR_VEDTAKSBREV]?.status == RessursStatus.SUKSESS && (
                <iframe
                  src={hentedeBrev[Brevtype.BREVEDITOR_VEDTAKSBREV]?.data}
                  width="100%"
                  height="100%"
                  allow="fullscreen"
                  style={{ border: 'none' }}
                />
              )}
            </>
          )}
        </div>
      )}
    </BrevContext.Provider>
  )
}
