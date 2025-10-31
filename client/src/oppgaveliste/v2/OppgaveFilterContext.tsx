import { SortState } from '@navikt/ds-react'
import { createContext, useContext } from 'react'

import {
  type OppgaveGjelderFilter,
  Oppgaveprioritet,
  type OppgaveSortState,
  Oppgavetype,
} from '../../oppgave/oppgaveTypes.ts'

interface OppgaveFilterContextType {
  oppgavetypeFilter: Oppgavetype[]
  gjelderFilter: Array<OppgaveGjelderFilter | string>
  oppgaveprioritetFilter: Oppgaveprioritet[]
  currentPage: number
  sort: OppgaveSortState
  setOppgavetypeFilter(oppgavetype: Oppgavetype[]): void
  setGjelderFilter(gjelder: OppgaveGjelderFilter[]): void
  setOppgaveprioritetFilter(oppgaveprioritet: Oppgaveprioritet[]): void
  setCurrentPage(currentPage: number): void
  setSort(sort: SortState): void
  clearFilters(): void
}

const initialSortState: OppgaveSortState = {
  orderBy: 'fristFerdigstillelse',
  direction: 'ascending',
}

export const initialState: OppgaveFilterContextType = {
  oppgavetypeFilter: [],
  gjelderFilter: [],
  oppgaveprioritetFilter: [],
  currentPage: 1,
  sort: initialSortState,
  setOppgavetypeFilter() {},
  setGjelderFilter() {},
  setOppgaveprioritetFilter() {},
  setCurrentPage() {},
  setSort() {},
  clearFilters() {},
}

export const OppgaveFilterContext = createContext<OppgaveFilterContextType>(initialState)
OppgaveFilterContext.displayName = 'OppgaveFilter'

export function useOppgaveFilterContext(): OppgaveFilterContextType {
  return useContext(OppgaveFilterContext)
}
