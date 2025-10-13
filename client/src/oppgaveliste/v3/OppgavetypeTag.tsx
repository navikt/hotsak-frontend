import { Tag } from '@navikt/ds-react'

import { Oppgavetype } from '../../oppgave/oppgaveTypes'

export function OppgavetypeTag({ oppgavetype }: { oppgavetype: Oppgavetype }) {
  return (
    <Tag size="small" variant="alt2">
      {tekst(oppgavetype)}
    </Tag>
  )
}

function tekst(oppgavetype: Oppgavetype): string {
  switch (oppgavetype) {
    case Oppgavetype.JOURNALFØRING:
      return 'Journalføring'
    case Oppgavetype.BEHANDLE_SAK:
      return 'Behandle sak'
    case Oppgavetype.GODKJENNE_VEDTAK:
      return 'Godkjenne vedtak'
    case Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK:
      return 'Behandle underkjent vedtak'
  }
}
