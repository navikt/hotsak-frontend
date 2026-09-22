import { Link } from '@navikt/ds-react'
import type { Oppgave } from '../oppgave/oppgaveTypes.ts'
import { OppgavetypeLabel } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveUrl } from '../oppgave/useOppgaveUrl'

export function OppgavetypeÅpneOppgaveCell({ row }: { row: Oppgave }) {
  const gosysLink = useOppgaveUrl(row.oppgaveId)
  const oppgavetype = OppgavetypeLabel[row.kategorisering.oppgavetype]

  if (!row.isBehandlesAvApplikasjonHotsak) {
    return (
      <Link href={gosysLink} target="_blank" rel="noreferrer">
        {row.kategorisering.oppgavetype}
      </Link>
    )
  }

  return (
    <Link href={`/oppgave/${row.oppgaveId}`} target="_blank" rel="noreferrer">
      {oppgavetype}
    </Link>
  )
}
