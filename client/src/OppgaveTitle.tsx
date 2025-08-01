import { useOppgaveId } from './oppgave/useOppgave.ts'

export function OppgaveTitle() {
  const oppgaveId = useOppgaveId()
  if (!oppgaveId) {
    return null
  }
  return <title>{`Hotsak - Oppgave ${oppgaveId}`}</title>
}
