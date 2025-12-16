import { useMemo } from 'react'

import { type DataGridColumn } from '../../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { oppgaveColumns } from './oppgaveColumns.tsx'
import { useOppgaveColumnsContext } from './OppgaveColumnsContext.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export function useOppgaveColumns(filterOptions: OppgaveFilterOptions): DataGridColumn<OppgaveV2>[] {
  const state = useOppgaveColumnsContext()
  return useMemo(() => {
    return state.map(({ field, checked }): DataGridColumn<OppgaveV2> => {
      const options = filterOptions[field]
      const column = oppgaveColumns[field] as DataGridColumn<OppgaveV2>
      return {
        ...column,
        ...(column.filter && options ? { filter: { ...column.filter, options } } : {}),
        hidden: !checked,
      }
    })
  }, [state, filterOptions])
}
