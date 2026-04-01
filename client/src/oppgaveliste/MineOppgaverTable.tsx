import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgavePaginationContext, useOppgavePaginationSortChangeHandler } from './OppgavePaginationContext.tsx'
import { selectOppgaveId } from './oppgaveSelectors.ts'
import { useOppgaveColumns } from './useOppgaveColumns.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'
import { useOppgavelisteFiltrertHandler } from './useOppgavelistemetrikker.ts'

export interface MineOppgaverTableProps {
  oppgaver: ReadonlyArray<Oppgave>
  filterOptions: OppgaveFilterOptions
  loading?: boolean
}

export function MineOppgaverTable(props: MineOppgaverTableProps) {
  const { oppgaver, filterOptions, loading } = props
  const columns = useOppgaveColumns(filterOptions)
  const { sort } = useOppgavePaginationContext()
  const handleSortChange = useOppgavePaginationSortChangeHandler()
  const handleFilterChange = useOppgavelisteFiltrertHandler()
  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={selectOppgaveId}
      renderContent={OppgaveDetails}
      size="small"
      stickyHeader
      textSize="small"
      emptyMessage="Ingen oppgaver funnet"
      loading={loading}
      sort={sort}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      zebraStripes
    />
  )
}
