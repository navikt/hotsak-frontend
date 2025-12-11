import { LinkButton } from '../../felleskomponenter/button/LinkButton.tsx'
import { DataGrid, type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { useOppgaveColumns } from './useOppgaveColumns.ts'

export interface MineOppgaverTableProps {
  oppgaver: OppgaveV2[]
  loading?: boolean
}

export function MineOppgaverTable(props: MineOppgaverTableProps) {
  const { oppgaver, loading } = props
  const { sort, setSort } = useOppgaveFilterContext()

  const columns = useOppgaveColumns(extraColumns)

  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={(oppgave) => oppgave.oppgaveId}
      renderContent={(oppgave, visible) => <OppgaveDetails oppgave={oppgave} visible={visible} />}
      size="small"
      textSize="small"
      emptyMessage="Ingen oppgaver funnet"
      loading={loading}
      sort={sort}
      onSortChange={(sortKey) => {
        setSort({
          orderBy: sortKey || 'fristFerdigstillelse',
          direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
        })
      }}
      zebraStripes
    />
  )
}

const extraColumns: DataGridColumn<OppgaveV2>[] = [
  {
    field: 'knapp',
    width: 150,
    renderCell(row) {
      return (
        <LinkButton size="xsmall" type="button" variant="tertiary" to={`/oppgave/${row.oppgaveId}`}>
          Åpne oppgave
        </LinkButton>
      )
    },
  },
]
