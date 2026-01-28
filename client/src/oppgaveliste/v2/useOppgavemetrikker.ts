import { useEffect } from 'react'
import { useDataGridFilterContext } from '../../felleskomponenter/data/DataGridFilterContext.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { getOppgaveColumn, OppgaveColumnField } from './oppgaveColumns.tsx'

export function useOppgavemetrikker() {
  const { logOppgavelisteFiltrert } = useUmami()
  const filterState = useDataGridFilterContext<OppgaveColumnField>()
  useEffect(() => {
    const entries = Object.entries(filterState).filter(([, { values }]) => values.size > 0)
    if (entries.length === 0) return
    const filtre = entries.map(([key, { values }]) => {
      const column = getOppgaveColumn(key as OppgaveColumnField)
      return { kolonne: column.header, verdier: [...values] }
    })
    logOppgavelisteFiltrert({ filtre })
  }, [filterState])
}
