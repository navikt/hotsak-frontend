import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { useOpppgavesøk } from '../oppgave/useOppgavesøk.ts'
import { oppgaveColumns } from '../oppgaveliste/oppgaveColumns.tsx'
import { selectOppgaveId } from '../oppgaveliste/oppgaveSelectors.ts'

export interface OppgaveoversiktPersonProps {
  fnr: string
}

export function OppgaveoversiktPerson(props: OppgaveoversiktPersonProps) {
  const { fnr } = props
  const { data } = useOpppgavesøk({ brukerId: fnr })
  if (!data) {
    return null
  }
  return <DataGrid rows={data.oppgaver} columns={columns} keyFactory={selectOppgaveId} size="small" />
}

const columns = [
  oppgaveColumns.åpneOppgave,
  oppgaveColumns.oppgavetype,
  oppgaveColumns.behandlingstema,
  oppgaveColumns.behandlingstype,
]
