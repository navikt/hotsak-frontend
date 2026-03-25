import { createContext, type Dispatch, useCallback, useContext } from 'react'

import { type OppgaveSortState } from '../oppgave/oppgaveTypes.ts'
import { useUmami } from '../sporing/useUmami.ts'

export interface OppgavePaginationState {
  currentPage: number
  sort: OppgaveSortState
}

export const initialState: OppgavePaginationState = {
  currentPage: 1,
  sort: {
    orderBy: 'fristFerdigstillelse',
    direction: 'ascending',
  },
}

export const OppgavePaginationContext = createContext<OppgavePaginationState>(initialState)
OppgavePaginationContext.displayName = 'OppgavePaginationContext'

export const OppgavePaginationDispatch = createContext<Dispatch<OppgavePaginationAction>>((state) => state)
OppgavePaginationDispatch.displayName = 'OppgavePaginationDispatch'

export function useOppgavePaginationContext(): OppgavePaginationState {
  return useContext(OppgavePaginationContext)
}

export function useOppgavePaginationDispatch(): Dispatch<OppgavePaginationAction> {
  return useContext(OppgavePaginationDispatch)
}

export function useOppgavePaginationSortChangeHandler(): (sortKey: string) => void {
  const {
    sort: { direction },
  } = useOppgavePaginationContext()
  const dispatch = useOppgavePaginationDispatch()
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

interface OppgavePaginationBaseAction {
  type: 'changePage' | 'sort'
}

export interface OppgavePaginationChangePageAction extends OppgavePaginationBaseAction {
  type: 'changePage'
  page: number
}

export interface OppgavePaginationSortAction extends OppgavePaginationBaseAction, Omit<OppgaveSortState, 'direction'> {
  type: 'sort'
}

export type OppgavePaginationAction = OppgavePaginationChangePageAction | OppgavePaginationSortAction
