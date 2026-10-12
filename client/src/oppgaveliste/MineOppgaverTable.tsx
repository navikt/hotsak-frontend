import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgavelisteContext, useOppgavelisteSortChangeHandler } from './OppgavelisteContext.tsx'
import { selectIsUlest, selectOppgaveId } from './oppgaveSelectors.ts'
import { useOppgaveColumns } from './useOppgaveColumns.ts'
import { type OppgaveFilterCounts, type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'
import { useOppgavelisteFiltrertHandler } from './useOppgavelistemetrikker.ts'

export interface MineOppgaverTableProps {
  oppgaver: ReadonlyArray<Oppgave>
  filterOptions: OppgaveFilterOptions
  filterCounts?: OppgaveFilterCounts
  loading?: boolean
}

export function MineOppgaverTable(props: MineOppgaverTableProps) {
  const { oppgaver, filterOptions, filterCounts, loading } = props
  const columns = useOppgaveColumns(filterOptions, filterCounts)
  const { currentTab, sort, filterModus } = useOppgavelisteContext()
  const handleSortChange = useOppgavelisteSortChangeHandler()
  const handleFilterChange = useOppgavelisteFiltrertHandler()
  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      scope={currentTab}
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
      filterMode={filterModus}
      isHighlighted={selectIsUlest}
      zebraStripes
    />
  )
}
