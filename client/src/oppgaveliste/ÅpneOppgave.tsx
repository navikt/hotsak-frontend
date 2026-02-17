import { LinkButton } from '../felleskomponenter/button/LinkButton.tsx'
import { type OppgaveV2 } from '../oppgave/oppgaveTypes.ts'

import classes from './ÅpneOppgave.module.css'

export interface ÅpneOppgaveProps {
  oppgave: OppgaveV2
}

export function ÅpneOppgave(props: ÅpneOppgaveProps) {
  const { oppgave } = props
  return (
    <LinkButton
      className={classes.root}
      size="xsmall"
      type="button"
      variant="tertiary"
      to={`/oppgave/${oppgave.oppgaveId}`}
    >
      Åpne oppgave
    </LinkButton>
  )
}
