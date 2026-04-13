import { useMemo } from 'react'

import { type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { getOppgaveColumn } from './oppgaveColumns.tsx'
import { useOppgavelisteColumnsContext } from './OppgavelisteColumnsContext.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export function useOppgaveColumns(filterOptions: OppgaveFilterOptions): DataGridColumn<Oppgave>[] {
  const columnsState = useOppgavelisteColumnsContext()
  return useMemo(() => {
    return columnsState.map(({ id, checked }): DataGridColumn<Oppgave> => {
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
