import { useMemo } from 'react'

import { type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { getOppgaveColumn } from './oppgaveColumns.tsx'
import { useOppgavelisteColumnsContext } from './OppgavelisteColumnsContext.ts'
import { useOppgaveFiltre } from './useOppgaveFiltre.ts'
import { type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export function useOppgaveColumns(filterOptions: OppgaveFilterOptions): DataGridColumn<Oppgave>[] {
  const columnsState = useOppgavelisteColumnsContext()
  const filtre = useOppgaveFiltre()
  return useMemo(() => {
    return columnsState.map(({ id, checked }): DataGridColumn<Oppgave> => {
      const options = filterOptions[id]
      const column = getOppgaveColumn(id)
      const allOptions = finnAlleVerdier(id, filtre)
      return {
        ...column,
        ...(column.filter && options ? { filter: { ...column.filter, options, allOptions } } : {}),
        hidden: !checked,
      }
    })
  }, [columnsState, filterOptions, filtre])
}

function finnAlleVerdier(id: string, filtere: ReturnType<typeof useOppgaveFiltre>): ReadonlySet<string> | undefined {
  switch (id) {
    case 'kommune':
      return filtere.områder.size > 0 ? filtere.områder : undefined
    case 'saksbehandler':
      return filtere.saksbehandlere.size > 0 ? filtere.saksbehandlere : undefined
    case 'behandlingstema':
      return filtere.gjelderVerdier.size > 0 ? filtere.gjelderVerdier : undefined
    case 'behandlingstype':
      return filtere.behandlingstyper.size > 0 ? filtere.behandlingstyper : undefined
    default:
      return undefined
  }
}
