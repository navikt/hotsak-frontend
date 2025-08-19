import { TaOppgaveButton } from '../oppgave/TaOppgaveButton.tsx'
import { useOppgave } from '../oppgave/useOppgave.ts'

export function TaOppgaveISakButton() {
  const { oppgave } = useOppgave()

  if (!oppgave) {
    return null
  }

  return (
    <TaOppgaveButton oppgave={oppgave} variant="secondary" size="small">
      Ta saken
    </TaOppgaveButton>
  )
}
