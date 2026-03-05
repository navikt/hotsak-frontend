import { type Oppgave } from './oppgaveTypes.ts'

export interface SettOppgavePåVentModalProps {
  oppgave: Oppgave
}

export function SettOppgavePåVentModal(props: SettOppgavePåVentModalProps) {
  const { oppgave } = props
  return oppgave.oppgaveId
}
