import { useNavigate } from 'react-router'

import { OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../oppgave/TaOppgaveButton.tsx'
import { Sakstype } from '../types/types.internal.ts'

export function TaOppgaveIOppgavelisteButton({ oppgave, kanTildeles }: { oppgave: OppgaveV2; kanTildeles?: boolean }) {
  const navigate = useNavigate()
  if (!kanTildeles) {
    return <>-</>
  }
  return (
    <TaOppgaveButton
      oppgave={oppgave}
      size="xsmall"
      variant="tertiary"
      onOppgavetildeling={(oppgaveId) => {
        if (oppgave.sakstype === Sakstype.TILSKUDD) {
          navigate(`/oppgave/${oppgaveId}`)
        } else {
          navigate(`/oppgave/${oppgaveId}/hjelpemidler`)
        }
      }}
    />
  )
}
