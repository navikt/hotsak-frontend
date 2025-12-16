import { DataGrid } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useHandleSortChange, useOppgavePaginationContext } from './OppgavePaginationContext.tsx'
import { useOppgaveColumns } from './useOppgaveColumns.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'
import { selectOppgaveId } from './oppgaveSelectors.ts'

export interface EnhetensOppgaverTableProps {
  oppgaver: OppgaveV2[]
  filterOptions: OppgaveFilterOptions
  loading?: boolean
}

export function EnhetensOppgaverTable(props: EnhetensOppgaverTableProps) {
  const { oppgaver, filterOptions, loading } = props
  const columns = useOppgaveColumns(filterOptions)
  const { sort } = useOppgavePaginationContext()
  const handleSortChange = useHandleSortChange()
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
