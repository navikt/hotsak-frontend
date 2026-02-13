import { DataGrid } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgavePaginationContext, useOppgavePaginationSortChangeHandler } from './OppgavePaginationContext.tsx'
import { selectOppgaveId } from './oppgaveSelectors.ts'
import { useOppgaveColumns } from './useOppgaveColumns.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export interface MineOppgaverTableProps {
  oppgaver: ReadonlyArray<OppgaveV2>
  filterOptions: OppgaveFilterOptions
  loading?: boolean
}

export function MineOppgaverTable(props: MineOppgaverTableProps) {
  const { oppgaver, filterOptions, loading } = props
  const columns = useOppgaveColumns(filterOptions)
  const { sort } = useOppgavePaginationContext()
  const handleSortChange = useOppgavePaginationSortChangeHandler()
  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={selectOppgaveId}
      renderContent={renderContent}
      size="small"
      textSize="small"
      emptyMessage="Ingen oppgaver funnet"
      loading={loading}
      sort={sort}
      onSortChange={handleSortChange}
      zebraStripes
    />
  )
}

function renderContent(oppgave: OppgaveV2, visible: boolean) {
  return <OppgaveDetails oppgave={oppgave} visible={visible} />
}
