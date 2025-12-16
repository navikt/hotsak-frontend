import { LinkButton } from '../../felleskomponenter/button/LinkButton.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'

export interface ÅpneOppgaveProps {
  oppgave: OppgaveV2
}

export function ÅpneOppgave(props: ÅpneOppgaveProps) {
  const { oppgave } = props
  return (
    <LinkButton size="xsmall" type="button" variant="tertiary" to={`/oppgave/${oppgave.oppgaveId}`}>
      Åpne oppgave
    </LinkButton>
  )
}
