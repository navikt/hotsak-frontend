import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { useOppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { oppgaveColumns } from '../oppgaveliste/oppgaveColumns.tsx'
import { selectOppgaveId } from '../oppgaveliste/oppgaveSelectors.ts'

export interface OppgaveoversiktPersonProps {
  fnr: string
}

export function OppgaveoversiktPerson(props: OppgaveoversiktPersonProps) {
  const { fnr } = props
  const { data, isLoading, isValidating, error } = useOppgavesøk({ brukerId: fnr })

  if (error) {
    return <div>Feil ved henting av oppgaver</div>
  }
  if (!data || data.oppgaver.length === 0) {
    return <div>Fant ingen oppgaver</div>
  }
  return (
    <DataGrid
      rows={data.oppgaver}
      columns={columns}
      keyFactory={selectOppgaveId}
      size="small"
      textSize="small"
      loading={isLoading}
      validating={isValidating}
    />
  )
}

const columns = [
  oppgaveColumns.åpneOppgave,
  oppgaveColumns.oppgavetype,
  oppgaveColumns.behandlingstema,
  oppgaveColumns.behandlingstype,
]
