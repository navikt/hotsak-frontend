import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { Sakstype } from '../types/types.internal.ts'

export function useSaksregler() {
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  return {
    sakId: oppgave?.sakId,
    kanBehandleSak: oppgaveErUnderBehandlingAvInnloggetAnsatt,
    kanEndreHjelpemiddel: oppgaveErUnderBehandlingAvInnloggetAnsatt,
    erBestilling: oppgave?.sak?.sakstype === Sakstype.BESTILLING,
  }
}
