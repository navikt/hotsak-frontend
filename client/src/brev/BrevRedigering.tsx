import { Loader, LocalAlert } from '@navikt/ds-react'
import { isToday } from 'date-fns'
import { useEffect } from 'react'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import {
  type Behandling,
  isBehandlingFerdigstilt,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallVedtak,
  VedtaksResultat,
} from '../sak/v2/behandling/behandlingTyper.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { formaterDatoLang } from '../utils/dato.ts'
import './Brev.less' // todo -> hvorfor less?
import { Breveditor } from './breveditor/Breveditor.tsx'
import { type BreveditorBrevdata, type BreveditorState, isBreveditorState } from './breveditor/breveditorTyper.ts'
import { BrevForhåndsvisning } from './BrevForhåndsvisning.tsx'
import { useBrevmal } from './brevmaler/useBrevmal.ts'
import classes from './BrevRedigering.module.css'
import { Brevmal } from './brevTyper.ts'
import { useBrev } from './useBrev.ts'
import { useBrevActions } from './useBrevActions.ts'

export interface BrevRedigeringProps {
  oppgave: Saksbehandlingsoppgave
  behandling?: Behandling
  brevId: string
}

export function BrevRedigering({ oppgave, behandling, brevId }: BrevRedigeringProps) {
  const { sak } = useSak()
  const { brev, isLoading: brevIsLoading, error: brevError } = useBrev<BreveditorBrevdata>(brevId)
  const { oppdaterBrevutkast, redigerBrevutkast } = useBrevActions(oppgave, brev?.brevId)
  const { showInfoToast } = useToast()

  const templateMarkdown = useBrevmal(utledBrevmal(behandling, brev?.brevmal), brev?.målform)

  // sett brev tilbake til utkast hvis dato det ble ferdigstilt er før i dag, slik at det får dagens dato
  useEffect(() => {
    if (
      brev?.brevmal === Brevmal.BREVEDITOR_VEDTAKSBREV &&
      brev.ferdigstilt &&
      !isToday(brev.ferdigstilt) &&
      !isBehandlingFerdigstilt(behandling)
    ) {
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
          <LocalAlert.Header>
            <LocalAlert.Title>Feil med lagring av utkast</LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            Får ikke kontakt med tjeneren, brev ikke tilgjengelig. Prøv igjen senere.
          </LocalAlert.Content>
        </LocalAlert>
      </div>
    )
  }

  if (!brev || !templateMarkdown) return null

  if (brev.ferdigstilt) {
    return (
      <div className="brev">
        <BrevForhåndsvisning brevId={brevId} />
      </div>
    )
  }

  const handleLagreBrev = async (state: BreveditorState, serienummer: number) => {
    await oppdaterBrevutkast.trigger({
      brevutkast: {
        brevmal: brev.brevmal,
        brevmalVersjon: brev.brevmalVersjon,
        målform: brev.målform,
        data: state,
      },
      serienummer,
    })
  }

  return (
    <div className="brev">
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
        initialState={isBreveditorState(brev.data) ? brev.data : undefined}
        initialSerienummer={brev.serienummer}
        stilarkVersjon={brev.brevmalVersjon}
        målform={brev.målform}
        spesiellePlaceholderVerdier={isBreveditorState(brev.data) ? undefined : brev.data.templateValues}
        onLagreBrev={handleLagreBrev}
      />
    </div>
  )
}

function utledBrevmal(behandling?: Behandling, brevmal?: Brevmal): string | undefined {
  if (brevmal === Brevmal.BREVEDITOR_SVARTIDSBREV) {
    return 'svartidsbrev'
  }
  if (brevmal === Brevmal.BREVEDITOR_INNHENTE_OPPLYSNINGER) {
    return 'innhente-opplysninger'
  }

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
