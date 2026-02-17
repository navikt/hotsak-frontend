import { useMemo } from 'react'

import { type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { type OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { getOppgaveColumn } from './oppgaveColumns.tsx'
import { useOppgaveColumnsContext } from './OppgaveColumnsContext.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export function useOppgaveColumns(filterOptions: OppgaveFilterOptions): DataGridColumn<OppgaveV2>[] {
  const columnsState = useOppgaveColumnsContext()
  return useMemo(() => {
    return columnsState.map(({ id, checked }): DataGridColumn<OppgaveV2> => {
      const options = filterOptions[id]
      const column = getOppgaveColumn(id)
      return {
        ...column,
        ...(column.filter && options ? { filter: { ...column.filter, options } } : {}),
        hidden: !checked,
      }
    })
  }, [columnsState, filterOptions])
}
