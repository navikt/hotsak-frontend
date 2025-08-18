import { SortState } from '@navikt/ds-react'
import { ReactNode } from 'react'

import { OppgaveTildeltFilter } from '../../oppgave/oppgaveTypes.ts'
import { useLocalState } from '../../state/useLocalState.ts'
import { initialState, OppgaveFilterContext } from './OppgaveFilterContext.tsx'

export function OppgaveFilterProvider({ children }: { children: ReactNode }) {
  const [tildeltFilter, setTildeltFilter] = useLocalState('oppgaverFilter', initialState.tildeltFilter)
  const [gjelderFilter, setGjelderFilter] = useLocalState('oppgavebenkGjelderFilter', initialState.gjelderFilter)
  const [currentPage, setCurrentPage] = useLocalState('currentPage', initialState.currentPage)
  const [sort, setSort] = useLocalState<SortState>('oppgavebenkSortState', initialState.sort)

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
