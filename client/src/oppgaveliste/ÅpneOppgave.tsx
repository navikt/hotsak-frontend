import { LinkButton } from '../felleskomponenter/button/LinkButton.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'

import classes from './ÅpneOppgave.module.css'

export interface ÅpneOppgaveProps {
  oppgave: Oppgave
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
