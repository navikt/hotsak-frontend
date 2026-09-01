import { Outlet } from 'react-router'
import { useOppgavehendelserForEnhet } from '../oppgave/useOppgavehendelser.ts'

export function Oppgaver() {
  useOppgavehendelserForEnhet()
  return <Outlet />
}
