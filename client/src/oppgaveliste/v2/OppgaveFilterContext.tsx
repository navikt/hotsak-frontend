import { type SortState } from '@navikt/ds-react'
import { createContext, useContext } from 'react'

import { Oppgaveprioritet, type OppgaveSortState, Oppgavetype } from '../../oppgave/oppgaveTypes.ts'

export interface OppgaveFilter<T = string> {
  displayName: string
  values: T[]
  setValues(values: T[]): void
  enabled: boolean
  setEnabled(enabled: boolean): void
}

interface OppgaveFilterContextType {
  filters: {
    oppgavetypeFilter: OppgaveFilter<Oppgavetype>
    behandlingstemaFilter: OppgaveFilter
    behandlingstypeFilter: OppgaveFilter
    mappeFilter: OppgaveFilter
    prioritetFilter: OppgaveFilter<Oppgaveprioritet>
    kommuneFilter: OppgaveFilter

    clear(): void
  }

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
  filters: {
    oppgavetypeFilter: {
      displayName: 'Oppgavetype',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    behandlingstemaFilter: {
      displayName: 'Gjelder',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    behandlingstypeFilter: {
      displayName: 'Behandlingstype',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    mappeFilter: {
      displayName: 'Mappe',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    prioritetFilter: {
      displayName: 'Prioritet',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    kommuneFilter: {
      displayName: 'Kommune',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },

    clear() {},
  },

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
