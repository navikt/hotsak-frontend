import { ReactNode } from 'react'

import { type OppgaveSortState, OppgaveTildeltFilter } from '../../oppgave/oppgaveTypes.ts'
import { useLocalState } from '../../state/useLocalState.ts'
import { initialState, OppgaveFilterContext } from './OppgaveFilterContext.tsx'

export function OppgaveFilterProvider({ children }: { children: ReactNode }) {
  const [tildeltFilter, setTildeltFilter] = useLocalState('oppgaveTildeltFilterV2', initialState.tildeltFilter)
  const [gjelderFilter, setGjelderFilter] = useLocalState('oppgaveGjelderFilterV2', initialState.gjelderFilter)
  const [currentPage, setCurrentPage] = useLocalState('oppgaveCurrentPageV2', initialState.currentPage)
  const [sort, setSort] = useLocalState<OppgaveSortState>('oppgaveSortV2', initialState.sort)

  function clearFilters() {
    setGjelderFilter([])
    setTildeltFilter(OppgaveTildeltFilter.INGEN)
    setSort(initialState.sort)
    setCurrentPage(1)
  }

  return (
    <OppgaveFilterContext.Provider
      value={{
        tildeltFilter,
        setTildeltFilter,
        gjelderFilter,
        setGjelderFilter,
        currentPage,
        setCurrentPage,
        sort,
        setSort,
        clearFilters,
      }}
    >
      {children}
    </OppgaveFilterContext.Provider>
  )
}
