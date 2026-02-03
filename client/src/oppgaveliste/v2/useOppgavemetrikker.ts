import { useEffect } from 'react'

import { useDataGridFilterContext } from '../../felleskomponenter/data/DataGridFilterContext.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { getOppgaveColumn, OppgaveColumnField } from './oppgaveColumns.tsx'
import { useOppgaveColumnsContext } from './OppgaveColumnsContext.ts'
import { useOppgavePaginationContext } from './OppgavePaginationContext.tsx'

export function useOppgavemetrikker(
  oppgaveliste: string,
  antallOppgaver: number = 0,
  totaltAntallOppgaver: number = 0
) {
  const { logOppgavelisteFiltrert, logOppgavelisteSortert, logOppgavelisteTilpasset } = useUmami()
  const filterState = useDataGridFilterContext<OppgaveColumnField>()
  useEffect(() => {
    const entries = Object.entries(filterState).filter(([, { values }]) => values.size > 0)
    if (entries.length === 0) return
    const data = entries.reduce<Record<string, any>>(
      (result, [field, { values }], index) => {
        const column = getOppgaveColumn(field as OppgaveColumnField)
        result[`kolonne_${index}`] = column.header
        result[`verdier_${index}`] = [...values].sort().join(' ELLER ')
        return result
      },
      { oppgaveliste, antallOppgaver, totaltAntallOppgaver }
    )
    logOppgavelisteFiltrert(data)
  }, [filterState])
  const { sort } = useOppgavePaginationContext()
  useEffect(() => {
    logOppgavelisteSortert({
      oppgaveliste,
      antallOppgaver,
      totaltAntallOppgaver,
      sorteringsfelt: sort.orderBy,
      sorteringsrekkefølge: sort.direction,
    })
  }, [sort])
  const columns = useOppgaveColumnsContext()
  useEffect(() => {
    const data = columns.reduce<Record<string, any>>(
      (result, columnState) => {
        result[columnState.field] = columnState.checked
        return result
      },
      { oppgaveliste, antallOppgaver, totaltAntallOppgaver }
    )
    logOppgavelisteTilpasset(data)
  }, [columns])
}
