import { DataGrid } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveId, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useHandleSortChange, useOppgavePaginationContext } from './OppgavePaginationContext.tsx'
import { useOppgaveColumns } from './useOppgaveColumns.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export interface MineOppgaverTableProps {
  oppgaver: OppgaveV2[]
  filterOptions: OppgaveFilterOptions
  loading?: boolean
}

export function MineOppgaverTable(props: MineOppgaverTableProps) {
  const { oppgaver, filterOptions, loading } = props
  const columns = useOppgaveColumns(filterOptions)
  const { sort } = useOppgavePaginationContext()
  const handleSortChange = useHandleSortChange()
  return (
    <DataGrid
      rows={oppgaver}
      columns={columns}
      keyFactory={keyFactory}
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

function keyFactory(oppgave: OppgaveV2): OppgaveId {
  return oppgave.oppgaveId
}

function renderContent(oppgave: OppgaveV2, visible: boolean) {
  return <OppgaveDetails oppgave={oppgave} visible={visible} />
}
