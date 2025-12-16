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
  return state.map((column) => {
    if (action.field !== column.field) {
      return column
    }
    switch (action.type) {
      case 'checked':
        return { ...column, checked: true }
      case 'unchecked':
        return { ...column, checked: false }
      default:
        return column
    }
  })
}
