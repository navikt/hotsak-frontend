import { SortState } from '@navikt/ds-react'
import { createContext, useContext } from 'react'

import { OppgaveGjelderFilter, OppgaveTildeltFilter } from '../../oppgave/oppgaveTypes.ts'

interface OppgaveFilterContextType {
  tildeltFilter: OppgaveTildeltFilter
  setTildeltFilter(tildelt: OppgaveTildeltFilter): void
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

export const initialState: OppgaveFilterContextType = {
  tildeltFilter: OppgaveTildeltFilter.INGEN,
  setTildeltFilter() {},
  gjelderFilter: [],
  setGjelderFilter() {},
  currentPage: 1,
  setCurrentPage() {},
  sort: initialSortState,
  setSort() {},
  clearFilters() {},
}

export const OppgaveFilterContext = createContext<OppgaveFilterContextType>(initialState)
OppgaveFilterContext.displayName = 'OppgaveFilter'

export function useFilterContext(): OppgaveFilterContextType {
  return useContext(OppgaveFilterContext)
}
