import { type ReactNode, useMemo } from 'react'

import { type OppgaveSortState } from '../../oppgave/oppgaveTypes.ts'
import { useLocalState } from '../../state/useLocalState.ts'
import { initialState, type OppgaveFilter, OppgaveFilterContext } from './OppgaveFilterContext.tsx'

export function OppgaveFilterProvider({ prefix, children }: { prefix: 'mine' | 'kø'; children: ReactNode }) {
  const key = (key: string) => prefix + key

  const filters = initialState.filters
  const oppgavetypeFilter = useOppgaveFilterState(key('OppgavetypeFilter'), filters.oppgavetypeFilter)
  const behandlingstypeFilter = useOppgaveFilterState(key('BehandlingstypeFilter'), filters.behandlingstypeFilter)
  const mappeFilter = useOppgaveFilterState(key('MappeFilter'), filters.mappeFilter)
  const gjelderFilter = useOppgaveFilterState(key('GjelderFilter'), filters.behandlingstemaFilter)
  const prioritetFilter = useOppgaveFilterState(key('PrioritetFilter'), filters.prioritetFilter)
  const kommuneFilter = useOppgaveFilterState(key('KommuneFilter'), filters.kommuneFilter)

  const [currentPage, setCurrentPage] = useLocalState(key('OppgaveCurrentPage'), initialState.currentPage)
  const [sort, setSort] = useLocalState<OppgaveSortState>(key('OppgaveSort'), initialState.sort)

  function clear() {
    setCurrentPage(1)
    setSort(initialState.sort)
  }

  return (
    <OppgaveFilterContext.Provider
      value={{
        filters: {
          oppgavetypeFilter,
          behandlingstemaFilter: gjelderFilter,
          behandlingstypeFilter,
          mappeFilter,
          prioritetFilter,
          kommuneFilter,

          clear,
        },
        currentPage,
        setCurrentPage,
        sort,
        setSort,
      }}
    >
      {children}
    </OppgaveFilterContext.Provider>
  )
}

function useOppgaveFilterState<T>(key: string, filter: OppgaveFilter<T>): OppgaveFilter<T> {
  const [state, setState] = useLocalState(key, { values: filter.values, enabled: filter.enabled })
  return useMemo(() => {
    return {
      ...filter,
      values: state.values,
      setValues(values: T[]) {
        setState((current) => ({ ...current, values }))
      },
      enabled: state.enabled,
      setEnabled(enabled: boolean) {
        setState((current) => ({ ...current, enabled }))
      },
    }
  }, [filter, state, setState])
}
