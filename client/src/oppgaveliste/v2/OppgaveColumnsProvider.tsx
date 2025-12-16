import { type ReactNode, useReducer } from 'react'

import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import {
  type OppgaveColumnsAction,
  OppgaveColumnsContext,
  OppgaveColumnsDispatchContext,
  type OppgaveColumnsState,
} from './OppgaveColumnsContext.ts'

export interface OppgaveColumnsProviderProps {
  defaultColumns: ReadonlyArray<OppgaveColumnField>
  children: ReactNode
}

export function OppgaveColumnsProvider(props: OppgaveColumnsProviderProps) {
  const { defaultColumns, children } = props
  const [state, dispatch] = useReducer(
    reducer,
    null,
    (): OppgaveColumnsState =>
      defaultColumns.map((field, order) => ({
        field,
        order,
        checked: true,
      }))
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
