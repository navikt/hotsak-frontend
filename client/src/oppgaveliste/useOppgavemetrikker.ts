import { useEffect } from 'react'

import { useDataGridFilterContext } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { useUmami } from '../sporing/useUmami.ts'
import { entriesOf } from '../utils/array.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
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
    const entries = entriesOf(filterState).filter(([, { values }]) => values.size > 0)
    if (entries.length === 0) return
    const data = entries.reduce<Record<string, any>>(
      (result, [field, { values }]) => {
        if (field === 'saksbehandler') {
          result[field] = true
        } else {
          result[field] = [...values].sort().join(' ELLER ')
        }
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
      (result, column) => {
        result[`${column.id}_checked`] = column.checked
        result[`${column.id}_order`] = column.order
        result[`${column.id}_defaultOrder`] = column.defaultOrder
        return result
      },
      { oppgaveliste, antallOppgaver, totaltAntallOppgaver }
    )
    logOppgavelisteTilpasset(data)
  }, [columns])
}
