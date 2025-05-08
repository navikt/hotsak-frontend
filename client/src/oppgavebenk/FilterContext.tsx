import { createContext, ReactNode, useContext } from 'react'
import { useLocalState } from '../state/useLocalState'
import { OppgaveGjelderFilter, TildeltFilter } from '../types/experimentalTypes'
import { SortState } from '@navikt/ds-react'

interface FilterContextType {
  tildeltFilter: TildeltFilter
  setTildeltFilter(tildelt: TildeltFilter): void
  gjelderFilter: OppgaveGjelderFilter[]
  setGjelderFilter(gjelder: OppgaveGjelderFilter[]): void
  currentPage: number
  setCurrentPage(currentPage: number): void
  sort: SortState
  setSort(sort: SortState): void
  clearFilters(): void
}

const initialSortState: SortState = {
  orderBy: 'OPPRETTET_TIDSPUNKT',
  direction: 'descending',
}

const initialState: FilterContextType = {
  tildeltFilter: TildeltFilter.INGEN,
  setTildeltFilter() {},
  gjelderFilter: [],
  setGjelderFilter() {},
  currentPage: 1,
  setCurrentPage() {},
  sort: initialSortState,
  setSort() {},
  clearFilters() {},
}

const FilterContext = createContext<FilterContextType>(initialState)
FilterContext.displayName = 'Filter'

function FilterProvider({ children }: { children: ReactNode }) {
  const [tildeltFilter, setTildeltFilter] = useLocalState('oppgaverFilter', initialState.tildeltFilter)
  const [gjelderFilter, setGjelderFilter] = useLocalState('oppgavebenkGjelderFilter', initialState.gjelderFilter)
  const [currentPage, setCurrentPage] = useLocalState('currentPage', initialState.currentPage)
  const [sort, setSort] = useLocalState<SortState>('oppgavebenkSortState', initialSortState)

  function clearFilters() {
    setGjelderFilter([])
    setTildeltFilter(TildeltFilter.INGEN)
    setSort(initialSortState)
    setCurrentPage(1)
  }

  return (
    <FilterContext.Provider
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
    </FilterContext.Provider>
  )
}

function useFilterContext(): FilterContextType {
  const context = useContext(FilterContext)

  if (!context) {
    throw new Error('usePersonContext must be used within a PersonProvider')
  }

  return context
}

export { FilterContext, FilterProvider, useFilterContext }
