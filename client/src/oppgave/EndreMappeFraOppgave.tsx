import { EndreMappeDialog } from '../felleskomponenter/EndreMappe.tsx'
import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { type Oppgave } from './oppgaveTypes.ts'

export interface EndreMappeFraOppgaveProps {
  oppgave: Oppgave
}

export function EndreMappeFraOppgave({ oppgave }: EndreMappeFraOppgaveProps) {
  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  if (åpenModal !== OppgaveModalType.ENDRE_MAPPE) {
    return null
  }

  return <EndreMappeDialog oppgave={oppgave} onClose={lukkModal} />
}
