import { SAK_HOTKEYS } from '../../hotkeys/hotkeys.ts'
import { useHotkey } from '../../hotkeys/useHotkey.ts'
import { useOppgave } from '../../oppgave/useOppgave.ts'
import { useOppgaveUrl } from '../../oppgave/useOppgaveUrl.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { useErPilot } from '../../tilgang/useTilgang.ts'
import { Gjenstående, isBehandlingsutfallVedtak, VedtaksResultat } from '../v2/behandling/behandlingTyper.ts'
import { useBehandling } from '../v2/behandling/useBehandling.ts'
import { useBehandlingActions } from '../v2/behandling/useBehandlingActions.ts'

export function useSakHotkeys({
  onAnnetResultat,
  onBrevMangler,
  onNotatIkkeFerdigstilt,
  onFattVedtak,
}: {
  onAnnetResultat: () => void
  onBrevMangler: () => void
  onNotatIkkeFerdigstilt: () => void
  onFattVedtak: () => void
}) {
  const erHotsakEksperimenter = useErPilot('hotsakEksperimenter')
  const { oppgave } = useOppgave()
  const oppgaveUrl = useOppgaveUrl(oppgave.oppgaveId)
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const { logOppgaveÅpnetIGosys } = useUmami()
  const { lagreBehandling } = useBehandlingActions()
  const { gjeldendeBehandling, mutate: mutateBehandling } = useBehandling()

  const harResultat = gjeldendeBehandling?.utfall != null
  const erInnvilget =
    isBehandlingsutfallVedtak(gjeldendeBehandling?.utfall) &&
    gjeldendeBehandling.utfall.utfall === VedtaksResultat.INNVILGET

  useHotkey(
    SAK_HOTKEYS.innvilgeUtenBrev,
    async () => {
      if (harResultat && !erInnvilget) {
        onAnnetResultat()
        return
      }
      await lagreBehandling({ utfall: VedtaksResultat.INNVILGET, type: 'VEDTAK' })
      const oppdatert = await mutateBehandling()
      const gjenstående = oppdatert?.behandlinger[0]?.gjenstående || []

      if (gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) || gjenstående.includes(Gjenstående.BREV_MANGLER)) {
        onBrevMangler()
      } else if (gjenstående.includes(Gjenstående.NOTAT_IKKE_FERDIGSTILT)) {
        onNotatIkkeFerdigstilt()
      } else {
        onFattVedtak()
      }
    },
    { enabled: erHotsakEksperimenter && oppgaveErUnderBehandlingAvInnloggetAnsatt, skipInInputFields: true }
  )

  useHotkey(
    SAK_HOTKEYS.åpneOppgaveIGosys,
    () => {
      logOppgaveÅpnetIGosys()
      window.open(oppgaveUrl, 'gosys')
    },
    { enabled: erHotsakEksperimenter, skipInInputFields: true }
  )
}
