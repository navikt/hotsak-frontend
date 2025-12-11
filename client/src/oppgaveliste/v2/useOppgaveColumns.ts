import { useMemo } from 'react'

import { type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { oppgaveColumns } from './oppgaveColumns.tsx'
import { useOppgaveColumnsContext } from './OppgaveColumnsContext.ts'

export function useOppgaveColumns(extraColumns: DataGridColumn<OppgaveV2>[]): DataGridColumn<OppgaveV2>[] {
  const contextColumns = useOppgaveColumnsContext()
  return useMemo(() => {
    return [
      ...extraColumns,
      ...contextColumns
        .filter((column) => (column.key as any) !== 'bruker')
        .filter((column) => column.checked)
        .map((column) => oppgaveColumns[column.key]),
    ]
  }, [extraColumns, contextColumns])
}
