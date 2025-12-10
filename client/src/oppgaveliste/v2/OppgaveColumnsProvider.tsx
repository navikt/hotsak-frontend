import { type ReactNode, useReducer } from 'react'

import { type OppgaveColumn } from './oppgaveColumns.tsx'
import {
  type OppgaveColumnsAction,
  OppgaveColumnsContext,
  OppgaveColumnsDispatchContext,
} from './OppgaveColumnsContext.ts'

export interface OppgaveColumnsProviderProps {
  defaultColumns: OppgaveColumn[]
  children: ReactNode
}

export function OppgaveColumnsProvider(props: OppgaveColumnsProviderProps) {
  const { defaultColumns, children } = props
  const [columns, dispatch] = useReducer(reducer, defaultColumns)
  return (
    <OppgaveColumnsContext value={columns}>
      <OppgaveColumnsDispatchContext value={dispatch}>{children}</OppgaveColumnsDispatchContext>
    </OppgaveColumnsContext>
  )
}

function reducer(columns: OppgaveColumn[], action: OppgaveColumnsAction) {
  return columns.map((column) => {
    if (action.key !== column.key) {
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
