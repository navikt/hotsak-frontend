import { useCallback } from 'react'

import { LinkButton } from '../felleskomponenter/button/LinkButton.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { mutateOppgave } from '../oppgave/useOppgave.ts'
import { preloadBehandling, preloadBehovsmelding, preloadSak } from '../sak/useSak.ts'
import { Sakstype } from '../types/types.internal.ts'
import classes from './ÅpneOppgave.module.css'

export interface ÅpneOppgaveProps {
  oppgave: Oppgave
}

export function ÅpneOppgave(props: ÅpneOppgaveProps) {
  const { oppgave } = props

  // fungerer ikke siden komponenten heter ÅpneOppgave
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const preload = useCallback(() => {
    if (oppgave.sak) {
      const sakId = oppgave.sak.sakId
      const tasks = [preloadSak(sakId), preloadBehandling(sakId), mutateOppgave(oppgave.oppgaveId, oppgave)]
      if (oppgave.sak.sakstype === Sakstype.BESTILLING || oppgave.sak.sakstype === 'SØKNAD') {
        tasks.push(preloadBehovsmelding(sakId))
      }
      return tasks
    }
  }, [oppgave])

  return (
    <LinkButton
      className={classes.root}
      size="xsmall"
      type="button"
      variant="secondary"
      to={`/oppgave/${oppgave.oppgaveId}`}
      onClick={preload}
    >
      Åpne
    </LinkButton>
  )
}
