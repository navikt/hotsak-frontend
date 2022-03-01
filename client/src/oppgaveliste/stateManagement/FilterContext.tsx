import { SortState } from '@navikt/ds-react'
import React, { useContext, useState } from 'react'
import { OmrådeFilter, OppgaveStatusType, SakerFilter } from '../../types/types.internal'

type FilterContextType = {
  sakerFilter: SakerFilter
  setSakerFilter: (filter: SakerFilter) => void
  statusFilter: OppgaveStatusType
  setStatusFilter: (filter: OppgaveStatusType) => void
  områdeFilter: OmrådeFilter
  setOmrådeFilter: (filter: OmrådeFilter) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  sort: SortState
  setSort: (page: any) => void
}

const initialSortState: SortState = { orderBy: 'MOTTATT', direction: 'ascending' }

const initialState = {
  sakerFilter: SakerFilter.UFORDELTE,
  setSakerFilter: () => {},
  statusFilter: OppgaveStatusType.ALLE,
  setStatusFilter: () => {},
  områdeFilter: OmrådeFilter.ALLE,
  setOmrådeFilter: () => {},
  currentPage: 1,
  setCurrentPage: () => {},
  sort: initialSortState,
  setSort: () => {},
}

const FilterContext = React.createContext<FilterContextType>(initialState)

const FilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [sakerFilter, setSakerFilter] = useState(() => {
    if (window.localStorage.getItem('sakerFilter') !== null) {
      let sf: SakerFilter = SakerFilter[window.localStorage.getItem('sakerFilter') as keyof typeof SakerFilter]
      return sf
    } else return initialState.sakerFilter
  })
  const [statusFilter, setStatusFilter] = useState(() => {
    if (window.localStorage.getItem('statusFilter') !== null) {
      let sf: OppgaveStatusType =
        OppgaveStatusType[window.localStorage.getItem('statusFilter') as keyof typeof OppgaveStatusType]
      return sf
    } else return initialState.statusFilter
  })

  const [områdeFilter, setOmrådeFilter] = useState(() => {
    if (window.localStorage.getItem('områdeFilter') !== null) {
      let sf: OmrådeFilter = OmrådeFilter[window.localStorage.getItem('områdeFilter') as keyof typeof OmrådeFilter]
      return sf
    } else return initialState.områdeFilter
  })
  const [currentPage, setCurrentPage] = useState(() => {
    if (window.localStorage.getItem('currentPage') !== null) {
      let sf: number = Number(window.localStorage.getItem('currentPage'))
      return sf
    } else return initialState.currentPage
  })
  const [sort, setSort] = useState(() => {
    if (window.localStorage.getItem('sortState') !== null) {
      let sf: SortState = JSON.parse(window.localStorage.getItem('sortState') || '')
      return sf
    } else return initialState.sort
  })

  React.useEffect(() => {
    window.localStorage.setItem('sakerFilter', sakerFilter)
    window.localStorage.setItem('områdeFilter', områdeFilter)
    window.localStorage.setItem('statusFilter', statusFilter)
    window.localStorage.setItem('currentPage', currentPage.toString())
    window.localStorage.setItem('sortState', JSON.stringify(sort))
  }, [sakerFilter, områdeFilter, statusFilter, currentPage, sort])

  return (
    <FilterContext.Provider
      value={{
        sakerFilter,
        setSakerFilter,
        statusFilter,
        setStatusFilter,
        områdeFilter,
        setOmrådeFilter,
        currentPage,
        setCurrentPage,
        sort,
        setSort,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext)

  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }

  return context
}

export { FilterContext, FilterProvider, useFilterContext }
