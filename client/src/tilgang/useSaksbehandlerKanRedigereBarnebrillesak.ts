import { Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'

export function useSaksbehandlerKanRedigereBarnebrillesak(): boolean {
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  if (!oppgave) {
    return false
  }
  const isOppgavetypeForRedigering =
    oppgave.kategorisering.oppgavetype === Oppgavetype.BEHANDLE_SAK ||
    oppgave.kategorisering.oppgavetype === Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK
  return isOppgavetypeForRedigering && oppgaveErUnderBehandlingAvInnloggetAnsatt && !oppgave.isPåVent
}
