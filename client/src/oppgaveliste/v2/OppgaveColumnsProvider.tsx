import { type ReactNode } from 'react'

import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import {
  type OppgaveColumnsAction,
  OppgaveColumnsContext,
  OppgaveColumnsDispatchContext,
  type OppgaveColumnsState,
} from './OppgaveColumnsContext.ts'
import { useLocalReducer } from '../../state/useLocalReducer.ts'
import { associateBy } from '../../utils/array.ts'

export interface OppgaveColumnsProviderProps {
  suffix: 'Mine' | 'Enhetens' | 'Medarbeiders'
  defaultColumns: ReadonlyArray<OppgaveColumnField>
  children: ReactNode
}

export function OppgaveColumnsProvider(props: OppgaveColumnsProviderProps) {
  const { suffix, defaultColumns, children } = props
  const [state, dispatch] = useLocalReducer(
    'oppgaveColumns' + suffix,
    reducer,
    (storedState = []): OppgaveColumnsState => {
      const columnByField = associateBy(storedState, (it) => it.field)
      return defaultColumns.map((field, order) => ({
        field,
        order,
        checked: columnByField[field]?.checked ?? true,
      }))
    }
  )
  return (
    <OppgaveColumnsContext value={state}>
      <OppgaveColumnsDispatchContext value={dispatch}>{children}</OppgaveColumnsDispatchContext>
    </OppgaveColumnsContext>
  )
}

function reducer(state: OppgaveColumnsState, action: OppgaveColumnsAction) {
  switch (action.type) {
    case 'checked':
      return state.map((column) => {
        return action.field === column.field ? { ...column, checked: true } : column
      })
    case 'unchecked':
      return state.map((column) => {
        return action.field === column.field ? { ...column, checked: false } : column
      })
    case 'reset':
      return state.map((column) => ({ ...column, checked: true }))
    default:
      return state
  }
}
