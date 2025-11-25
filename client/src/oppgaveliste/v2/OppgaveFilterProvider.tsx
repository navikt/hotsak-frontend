import { type ReactNode, useCallback, useMemo } from 'react'

import { type OppgaveSortState } from '../../oppgave/oppgaveTypes.ts'
import { useLocalState } from '../../state/useLocalState.ts'
import { initialState, type OppgaveFilter, OppgaveFilterContext } from './OppgaveFilterContext.tsx'

export function OppgaveFilterProvider({ suffix, children }: { suffix: 'Mine' | 'Kø'; children: ReactNode }) {
  const key = (key: string) => key + suffix

  const filters = initialState.filters
  const oppgavetypeFilter = useOppgaveFilterState(key('oppgavetypeFilter'), filters.oppgavetypeFilter)
  const behandlingstemaFilter = useOppgaveFilterState(key('behandlingstemaFilter'), filters.behandlingstemaFilter)
  const behandlingstypeFilter = useOppgaveFilterState(key('behandlingstypeFilter'), filters.behandlingstypeFilter)
  const mappeFilter = useOppgaveFilterState(key('mappeFilter'), filters.mappeFilter)
  const prioritetFilter = useOppgaveFilterState(key('prioritetFilter'), filters.prioritetFilter)
  const kommuneFilter = useOppgaveFilterState(key('kommuneFilter'), filters.kommuneFilter)

  const [currentPage, setCurrentPage] = useLocalState(key('OppgaveCurrentPage'), initialState.currentPage)
  const [sort, setSort] = useLocalState<OppgaveSortState>(key('OppgaveSort'), initialState.sort)

  const clear = useCallback(() => {
    setCurrentPage(1)
    setSort(initialState.sort)
  }, [setCurrentPage, setSort])

  const value = useMemo(() => {
    return {
      filters: {
        oppgavetypeFilter,
        behandlingstemaFilter,
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
    }
  }, [
    oppgavetypeFilter,
    behandlingstemaFilter,
    behandlingstypeFilter,
    mappeFilter,
    prioritetFilter,
    kommuneFilter,
    clear,
    currentPage,
    setCurrentPage,
    sort,
    setSort,
  ])

  return <OppgaveFilterContext value={value}>{children}</OppgaveFilterContext>
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
        if (enabled) {
          setState((current) => ({ ...current, enabled }))
        } else {
          setState({ values: [], enabled })
        }
      },
    }
  }, [filter, state, setState])
}
