import { type SortState } from '@navikt/ds-react'
import { createContext, type Dispatch, useCallback, useContext } from 'react'

import { useUmami } from '../sporing/useUmami.ts'

export interface OppgavelisteSortState extends SortState {
  orderBy: 'fristFerdigstillelse' | 'opprettetTidspunkt' | 'fnr' | 'fødselsdato' | 'alder' | string
}

export const OppgaveToolbarTab = {
  ALLE: 'ALLE',
  HASTESAKER: 'HASTESAKER',
  PÅ_VENT: 'PÅ_VENT',
  FERDIGSTILTE: 'FERDIGSTILTE',
} as const

export type OppgaveToolbarTab = keyof typeof OppgaveToolbarTab

export interface OppgavelisteState {
  currentTab: OppgaveToolbarTab
  currentPage: number
  sort: OppgavelisteSortState
}

export const initialState: OppgavelisteState = {
  currentTab: OppgaveToolbarTab.ALLE,
  currentPage: 1,
  sort: {
    orderBy: 'fristFerdigstillelse',
    direction: 'ascending',
  },
}

export const OppgavelisteContext = createContext<OppgavelisteState>(initialState)
OppgavelisteContext.displayName = 'OppgavelisteContext'

export const OppgavelisteDispatch = createContext<Dispatch<OppgavePaginationAction>>((state) => state)
OppgavelisteDispatch.displayName = 'OppgavelisteDispatch'

export function useOppgavelisteContext(): OppgavelisteState {
  return useContext(OppgavelisteContext)
}

export function useOppgavelisteDispatch(): Dispatch<OppgavePaginationAction> {
  return useContext(OppgavelisteDispatch)
}

export function useOppgavelisteTabChangeHandler(): (value: string) => void {
  const dispatch = useOppgavelisteDispatch()
  return useCallback(
    (value) => {
      dispatch({
        type: 'changeTab',
        tab: value as OppgaveToolbarTab,
      })
    },
    [dispatch]
  )
}

export function useOppgavelisteSortChangeHandler(): (sortKey: string) => void {
  const {
    sort: { direction },
  } = useOppgavelisteContext()
  const dispatch = useOppgavelisteDispatch()
  const { logOppgavelisteSortert } = useUmami()
  return useCallback(
    (sortKey) => {
      // NB! rekkefølgen her er den reducer vil sette
      logOppgavelisteSortert({ kolonne: sortKey, rekkefølge: direction === 'descending' ? 'stigende' : 'synkende' })
      dispatch({
        type: 'sort',
        orderBy: sortKey || 'fristFerdigstillelse',
      })
    },
    [logOppgavelisteSortert, direction, dispatch]
  )
}

interface OppgavelisteBaseAction {
  type: 'changeTab' | 'changePage' | 'sort'
}

export interface OppgavelisteChangeTabAction extends OppgavelisteBaseAction {
  type: 'changeTab'
  tab: OppgaveToolbarTab
}

export interface OppgavelisteChangePageAction extends OppgavelisteBaseAction {
  type: 'changePage'
  page: number
}

export interface OppgavelisteSortAction extends OppgavelisteBaseAction, Omit<OppgavelisteSortState, 'direction'> {
  type: 'sort'
}

export type OppgavePaginationAction =
  | OppgavelisteChangeTabAction
  | OppgavelisteChangePageAction
  | OppgavelisteSortAction
