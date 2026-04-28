import { SAK_HOTKEYS } from '../../hotkeys/hotkeys.ts'
import { useHotkey } from '../../hotkeys/useHotkey.ts'
import { useOppgave } from '../../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler.ts'
import { useMiljø } from '../../utils/useMiljø.ts'
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
  const { erIkkeProd } = useMiljø()
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
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
    { enabled: erIkkeProd && oppgaveErUnderBehandlingAvInnloggetAnsatt, skipInInputFields: true }
  )
}
