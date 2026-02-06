import { arrayMove } from '@dnd-kit/sortable'
import { type ReactNode } from 'react'

import { useLocalReducer } from '../../state/useLocalReducer.ts'
import { associateBy } from '../../utils/array.ts'
import { type OppgaveColumnField } from './oppgaveColumns.tsx'
import {
  type OppgaveColumnsAction,
  OppgaveColumnsContext,
  OppgaveColumnsDispatchContext,
  type OppgaveColumnsState,
} from './OppgaveColumnsContext.ts'

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
      const columnsByField = associateBy(storedState, (it) => it.field)
      return defaultColumns
        .map((field, order) => {
          const column = columnsByField[field]
          return {
            id: field,
            field,
            order: column?.order ?? order,
            checked: column?.checked ?? true,
          }
        })
        .sort((a, b) => a.order - b.order)
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
    case 'dragged': {
      const oldIndex = state.findIndex(({ id }) => id == action.activeId)
      const newIndex = state.findIndex(({ id }) => id == action.overId)
      return arrayMove([...state], oldIndex, newIndex).map((column, order) => ({
        ...column,
        order,
      }))
    }
    default:
      return state
  }
}
