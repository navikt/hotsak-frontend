import { type SortState } from '@navikt/ds-react'
import { createContext, useContext } from 'react'

import { type OppgaveSortState } from '../../oppgave/oppgaveTypes.ts'

interface OppgaveFilterContextType {
  currentPage: number
  setCurrentPage(currentPage: number): void

  sort: OppgaveSortState
  setSort(sort: SortState): void
}

const initialSortState: OppgaveSortState = {
  orderBy: 'fristFerdigstillelse',
  direction: 'ascending',
}

export const initialState: OppgaveFilterContextType = {
  currentPage: 1,
  setCurrentPage() {},

  sort: initialSortState,
  setSort() {},
}

export const OppgaveFilterContext = createContext<OppgaveFilterContextType>(initialState)
OppgaveFilterContext.displayName = 'OppgaveFilter'

export function useOppgaveFilterContext(): OppgaveFilterContextType {
  return useContext(OppgaveFilterContext)
}
