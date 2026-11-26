import { DataGrid, type DataGridProps } from '../felleskomponenter/data/DataGrid'
import type { Oppgave } from '../oppgave/oppgaveTypes'
import { OppgaveDetails } from './OppgaveDetails'
import { useOppgavelisteContext, useOppgavelisteSortChangeHandler } from './OppgavelisteContext'
import { selectOppgaveId } from './oppgaveSelectors'
import { useOppgaveColumns } from './useOppgaveColumns'
import type { OppgaveFilterCounts, OppgaveFilterOptions } from './useOppgaveFilterOptions'
import { useOppgavelisteFiltrertHandler } from './useOppgavelistemetrikker'

export interface OppgaverTableProps extends Omit<DataGridProps<Oppgave, any>, 'rows' | 'columns' | 'keyFactory'> {
  oppgaver: ReadonlyArray<Oppgave>
  filterOptions: OppgaveFilterOptions
  filterCounts?: OppgaveFilterCounts
  loading?: boolean
}

export function OppgaverTable(props: OppgaverTableProps) {
  const { oppgaver, filterOptions, filterCounts, loading, ...rest } = props
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
      textSize="small"
      emptyMessage="Ingen oppgaver funnet"
      loading={loading}
      sort={sort}
      onSortChange={handleSortChange}
      onFilterChange={handleFilterChange}
      filterMode={filterModus}
      stickyHeader
      zebraStripes
      {...rest}
    />
  )
}
