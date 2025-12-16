import { DataGrid } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { useOppgaveColumns } from './useOppgaveColumns.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export interface MineOppgaverTableProps {
  oppgaver: OppgaveV2[]
  filterOptions: OppgaveFilterOptions
  loading?: boolean
}

export function MineOppgaverTable(props: MineOppgaverTableProps) {
  const { oppgaver, filterOptions, loading } = props
  const { sort, setSort } = useOppgaveFilterContext()
  const columns = useOppgaveColumns(filterOptions)
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
