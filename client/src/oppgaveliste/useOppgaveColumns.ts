import { useMemo } from 'react'

import { type DataGridColumn } from '../felleskomponenter/data/DataGrid.tsx'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { getOppgaveColumn } from './oppgaveColumns.tsx'
import { useOppgavelisteColumnsContext } from './OppgavelisteColumnsContext.ts'
import { useOppgavelisteContext } from './OppgavelisteContext.tsx'
import { useOppgaveFiltre } from './useOppgaveFiltre.ts'
import { type OppgaveFilterCounts, type OppgaveFilterOptions } from './useOppgaveFilterOptions.ts'

export function useOppgaveColumns(
  filterOptions: OppgaveFilterOptions,
  filterCounts?: OppgaveFilterCounts
): DataGridColumn<Oppgave>[] {
  const columnsState = useOppgavelisteColumnsContext()
  const filtre = useOppgaveFiltre()
  const { visAntallIFiltre } = useOppgavelisteContext()
  return useMemo(() => {
    return columnsState.map(({ id, checked }): DataGridColumn<Oppgave> => {
      const options = filterOptions[id]
      const column = getOppgaveColumn(id)
      const allOptions = finnAlleVerdier(id, filtre)
      const counts = visAntallIFiltre ? filterCounts?.[id] : undefined
      return {
        ...column,
        ...(column.filter ? { filter: { ...column.filter, ...(options ? { options, allOptions } : {}), counts } } : {}),
        hidden: !checked,
      }
    })
  }, [columnsState, filterOptions, filterCounts, visAntallIFiltre, filtre])
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
    case 'mappenavn':
      return filtere.mapper.size > 0 ? filtere.mapper : undefined
    default:
      return undefined
  }
}
