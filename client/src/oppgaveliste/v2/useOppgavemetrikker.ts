import { useEffect } from 'react'

import { useDataGridFilterContext } from '../../felleskomponenter/data/DataGridFilterContext.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { getOppgaveColumn, OppgaveColumnField } from './oppgaveColumns.tsx'
import { useOppgavePaginationContext } from './OppgavePaginationContext.tsx'

export function useOppgavemetrikker(antallOppgaver: number = 0, totaltAntallOppgaver: number = 0) {
  const { logOppgavelisteFiltrert, logOppgavelisteSortert } = useUmami()
  const filterState = useDataGridFilterContext<OppgaveColumnField>()
  useEffect(() => {
    const entries = Object.entries(filterState).filter(([, { values }]) => values.size > 0)
    if (entries.length === 0) return
    const data = entries.reduce<Record<string, any>>(
      (result, [key, { values }], index) => {
        const column = getOppgaveColumn(key as OppgaveColumnField)
        result[`kolonne_${index}`] = column.header
        result[`verdier_${index}`] = [...values].sort().join(' ELLER ')
        return result
      },
      { antallOppgaver, totaltAntallOppgaver }
    )
    logOppgavelisteFiltrert(data)
  }, [filterState])
  const { sort } = useOppgavePaginationContext()
  useEffect(() => {
    logOppgavelisteSortert({
      antallOppgaver,
      totaltAntallOppgaver,
      sorteringsfelt: sort.orderBy,
      sorteringsrekkefølge: sort.direction,
    })
  }, [sort])
}
