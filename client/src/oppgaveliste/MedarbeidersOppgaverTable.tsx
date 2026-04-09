import { DataGrid } from '../felleskomponenter/data/DataGrid.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgavelisteContext, useOppgavelisteSortChangeHandler } from './OppgavelisteContext.tsx'
import { selectOppgaveId } from './oppgaveSelectors.ts'
import { useOppgaveColumns } from './useOppgaveColumns.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'
import { useOppgavelisteFiltrertHandler } from './useOppgavelistemetrikker.ts'

export interface MedarbeidersOppgaverTableProps {
  oppgaver: ReadonlyArray<Oppgave>
  filterOptions: OppgaveFilterOptions
  loading?: boolean
}

export function MedarbeidersOppgaverTable(props: MedarbeidersOppgaverTableProps) {
  const { oppgaver, filterOptions, loading } = props
  const columns = useOppgaveColumns(filterOptions)
  const { sort } = useOppgavelisteContext()
  const handleSortChange = useOppgavelisteSortChangeHandler()
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
