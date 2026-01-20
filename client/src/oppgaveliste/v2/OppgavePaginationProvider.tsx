import { type ReactNode } from 'react'

import { useLocalReducer } from '../../state/useLocalReducer.ts'

import {
  initialState,
  type OppgavePaginationAction,
  OppgavePaginationContext,
  OppgavePaginationDispatch,
  type OppgavePaginationState,
} from './OppgavePaginationContext.tsx'

export function OppgavePaginationProvider({
  suffix,
  children,
}: {
  suffix: 'Mine' | 'Enhetens' | 'Medarbeiders'
  children: ReactNode
}) {
  const [state, dispatch] = useLocalReducer('oppgavePagination' + suffix, reducer, initialState)
  return (
    <OppgavePaginationContext value={state}>
      <OppgavePaginationDispatch value={dispatch}>{children}</OppgavePaginationDispatch>
    </OppgavePaginationContext>
  )
}

function reducer(state: OppgavePaginationState, action: OppgavePaginationAction): OppgavePaginationState {
  switch (action.type) {
    case 'changePage':
      return { ...state, currentPage: action.page }
    case 'sort':
      return {
        ...state,
        sort: {
          orderBy: action.orderBy,
          direction: state.sort.direction === 'ascending' ? 'descending' : 'ascending',
        },
      }
    default:
      return state
  }
}
