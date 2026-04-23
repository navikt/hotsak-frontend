import { preload } from 'swr'

import { LinkButton } from '../felleskomponenter/button/LinkButton.tsx'
import { http } from '../io/HttpClient.ts'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../types/types.internal.ts'

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
      variant="secondary"
      to={`/oppgave/${oppgave.oppgaveId}`}
      onClick={() => {
        if (oppgave.sak) {
          preload(`/api/sak/${oppgave.sak.sakId}`, http.get)
          preload(`/api/sak/${oppgave.sak.sakId}/behandling`, http.get)
          if (oppgave.sak.sakstype === Sakstype.BESTILLING || oppgave.sak.sakstype === 'SØKNAD') {
            preload(`/api/sak/${oppgave.sak.sakId}/behovsmelding`, http.get)
          }
        }
      }}
    >
      Åpne
    </LinkButton>
  )
}
