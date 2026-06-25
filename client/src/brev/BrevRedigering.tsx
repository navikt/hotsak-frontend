import { Button, Loader, LocalAlert } from '@navikt/ds-react'
import { isToday } from 'date-fns'
import { useEffect, useState } from 'react'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import {
  type Behandling,
  isBehandlingFerdigstilt,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallVedtak,
  VedtaksResultat,
} from '../sak/v2/behandling/behandlingTyper.ts'
import { useClosePanel } from '../sak/v2/paneler/usePanelHooks.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { formaterDatoLang } from '../utils/dato.ts'
import './Brev.less' // todo -> hvorfor less?
import { BrevContext } from './BrevContext.ts'
import { Breveditor, type BreveditorState } from './breveditor/Breveditor.tsx'
import { type PlaceholderFeil, validerPlaceholders } from './breveditor/plugins/placeholder/PlaceholderFeil.ts'
import { BrevForhåndsvisning } from './BrevForhåndsvisning.tsx'
import { useBrevmal } from './brevmaler/useBrevmal.ts'
import classes from './BrevRedigering.module.css'
import { SlettBrevModal } from './SlettBrevModal.tsx'
import { useBrev } from './useBrev.ts'
import { useBrevActions } from './useBrevActions.ts'

export interface BrevRedigeringProps {
  oppgave: Saksbehandlingsoppgave
  behandling: Behandling
  brevId: string
}

export function BrevRedigering({ oppgave, behandling, brevId }: BrevRedigeringProps) {
  const { sak } = useSak()

  const closePanel = useClosePanel('brevpanel')
  const [visSlettBrevModal, setVisSlettBrevModal] = useState(false)

  const { brev, isLoading: brevIsLoading, error: brevError } = useBrev<BreveditorState>(brevId)

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

  const { showInfoToast } = useToast()

  const templateMarkdown = useBrevmal(utledBrevmal(behandling))

  // sett brev tilbake til utkast hvis dato det ble ferdigstilt er før i dag, slik at det får dagens dato
  useEffect(() => {
    if (brev?.ferdigstilt && !isToday(brev.ferdigstilt) && !isBehandlingFerdigstilt(behandling)) {
      redigerBrevutkast.trigger().then(() => {
        showInfoToast(
          'Brevet knyttet til denne behandlingen ble ferdigstilt før dagens dato og er nå satt tilbake til utkast. Ferdigstill brevet på nytt hvis du skal ferdigstille behandlingen.'
        )
      })
    }
  }, [brev?.ferdigstilt])

  if (brevIsLoading) {
    return (
      <div className={classes.loaderContainer}>
        <Loader title="Laster inn brevutkast..." />
      </div>
    )
  }

  if (brevError) {
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

  if (!brev || !templateMarkdown) return null

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
      <div className="brev">
        {brev.ferdigstilt ? (
          <>
            <div className="brevtoolbar">
              <div className="left" />
              <div className="right">
                <Button variant="tertiary" size="small" onClick={() => markerKlart(false)}>
                  Rediger
                </Button>
              </div>
            </div>
            <BrevForhåndsvisning brevId={brevId} />
          </>
        ) : (
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
              brevId={brev.brevId}
              templateMarkdown={templateMarkdown}
              initialState={brev.data}
              onLagreBrev={handleLagreBrev}
            />
          </>
        )}
      </div>
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

function utledBrevmal(behandling?: Behandling): string | undefined {
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
