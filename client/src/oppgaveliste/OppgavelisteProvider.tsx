import { type ReactNode } from 'react'
import { DataGridFilterProvider } from '../felleskomponenter/data/DataGridFilterProvider.tsx'

import { useLocalReducer } from '../state/useLocalReducer.ts'
import type { DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteColumnsProvider } from './OppgavelisteColumnsProvider.tsx'
import {
  initialState,
  OppgavelisteContext,
  OppgavelisteDispatch,
  type OppgavelisteState,
  type OppgavePaginationAction,
} from './OppgavelisteContext.tsx'

export interface OppgavelisteProviderProps {
  suffix: 'Mine' | 'Enhetens' | 'Medarbeiders'
  defaultColumns: DefaultOppgaveColumns
  children: ReactNode
}

export function OppgavelisteProvider(props: OppgavelisteProviderProps) {
  const { suffix, defaultColumns, children } = props
  const [state, dispatch] = useLocalReducer('oppgaveliste' + suffix, reducer, initialState)
  return (
    <OppgavelisteContext value={state}>
      <OppgavelisteDispatch value={dispatch}>
        <OppgavelisteColumnsProvider suffix={suffix} defaultColumns={defaultColumns}>
          <DataGridFilterProvider suffix={suffix}>{children}</DataGridFilterProvider>
        </OppgavelisteColumnsProvider>
      </OppgavelisteDispatch>
    </OppgavelisteContext>
  )
}

function reducer(state: OppgavelisteState, action: OppgavePaginationAction): OppgavelisteState {
  switch (action.type) {
    case 'changeTab':
      return { ...state, currentTab: action.tab }
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
