import { type SortState } from '@navikt/ds-react'
import { createContext, useContext } from 'react'

import { Oppgaveprioritet, type OppgaveSortState, Oppgavetype } from '../../oppgave/oppgaveTypes.ts'
import { type UniqueOppgaveValues } from './useUniqueOppgaveValues.ts'

export interface OppgaveFilter<T = string> {
  key: keyof UniqueOppgaveValues
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
      key: 'oppgavetyper',
      displayName: 'Oppgavetype',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    behandlingstemaFilter: {
      key: 'behandlingstemaer',
      displayName: 'Gjelder',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    behandlingstypeFilter: {
      key: 'behandlingstyper',
      displayName: 'Behandlingstype',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    mappeFilter: {
      key: 'mapper',
      displayName: 'Mappe',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    prioritetFilter: {
      key: 'prioriteter',
      displayName: 'Prioritet',
      values: [],
      enabled: false,
      setValues() {},
      setEnabled() {},
    },
    kommuneFilter: {
      key: 'kommuner',
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
