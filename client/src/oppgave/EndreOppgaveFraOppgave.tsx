import { EndreOppgaveModal } from './EndreOppgaveModal.tsx'
import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { type Oppgave } from './oppgaveTypes.ts'

export interface EndreOppgaveFraOppgaveProps {
  oppgave: Oppgave
}

export function EndreOppgaveFraOppgave({ oppgave }: EndreOppgaveFraOppgaveProps) {
  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  if (åpenModal !== OppgaveModalType.ENDRE_OPPGAVE) {
    return null
  }

  return <EndreOppgaveModal oppgave={oppgave} onClose={lukkModal} />
}
