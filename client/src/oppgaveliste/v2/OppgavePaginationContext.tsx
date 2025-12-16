import { createContext, type Dispatch, useCallback, useContext } from 'react'

import { type OppgaveSortState } from '../../oppgave/oppgaveTypes.ts'

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

export function useHandleSortChange(): (sortKey: string) => void {
  const dispatch = useOppgavePaginationDispatch()
  return useCallback(
    (sortKey) => {
      dispatch({
        type: 'sort',
        orderBy: sortKey || 'fristFerdigstillelse',
      })
    },
    [dispatch]
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
