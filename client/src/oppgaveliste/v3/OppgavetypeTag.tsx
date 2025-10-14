import { Tag } from '@navikt/ds-react'

import { Oppgavetype, OppgavetypeLabel } from '../../oppgave/oppgaveTypes'

export function OppgavetypeTag({ oppgavetype }: { oppgavetype: Oppgavetype }) {
  return (
    <Tag size="small" variant="alt2">
      {OppgavetypeLabel[oppgavetype]}
    </Tag>
  )
}
