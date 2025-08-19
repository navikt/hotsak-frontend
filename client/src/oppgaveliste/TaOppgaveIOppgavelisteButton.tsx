import { useNavigate } from 'react-router'

import { OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../oppgave/TaOppgaveButton.tsx'

export function TaOppgaveIOppgavelisteButton({ oppgave }: { oppgave: OppgaveV2 }) {
  const navigate = useNavigate()
  return (
    <TaOppgaveButton
      oppgave={oppgave}
      size="xsmall"
      variant="tertiary"
      onOppgavetildeling={(oppgaveId) => {
        return navigate(`/oppgave/${oppgaveId}`)
      }}
    />
  )
}
