import { useBrevMetadata } from '../../brev/useBrevMetadata.ts'
import { SAK_HOTKEYS } from '../../hotkeys/hotkeys.ts'
import { useHotkey } from '../../hotkeys/useHotkey.ts'
import { useOppgave } from '../../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler.ts'
import { useMiljø } from '../../utils/useMiljø.ts'
import { Gjenstående, isBehandlingsutfallVedtak, VedtaksResultat } from '../v2/behandling/behandlingTyper.ts'
import { useBehandling } from '../v2/behandling/useBehandling.ts'
import { useBehandlingActions } from '../v2/behandling/useBehandlingActions.ts'

export function useSakHotkeys({
  gjenstående,
  onNotatIkkeFerdigstilt,
  onBrevFinnesIUtkast,
  onAnnetResultat,
}: {
  gjenstående: Gjenstående[]
  onNotatIkkeFerdigstilt: () => void
  onAnnetResultat: () => void
  onBrevFinnesIUtkast: () => void
}) {
  const { erIkkeProd } = useMiljø()
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const { lagreBehandling, ferdigstillBehandling } = useBehandlingActions()
  const { gjeldendeBehandling } = useBehandling()
  const { harBrevISak } = useBrevMetadata()

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
      if (gjenstående.includes(Gjenstående.NOTAT_IKKE_FERDIGSTILT)) {
        onNotatIkkeFerdigstilt()
        return
      }
      if (harBrevISak || gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT)) {
        onBrevFinnesIUtkast()
        return
      }

      await lagreBehandling({ utfall: VedtaksResultat.INNVILGET, type: 'VEDTAK' })
      await ferdigstillBehandling({})
    },
    { enabled: erIkkeProd && oppgaveErUnderBehandlingAvInnloggetAnsatt, skipInInputFields: true }
  )
}
