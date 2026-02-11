import { type UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { type ReactNode } from 'react'

import { useLocalReducer } from '../../state/useLocalReducer.ts'
import { associateBy } from '../../utils/array.ts'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import {
  type OppgaveColumnsAction,
  OppgaveColumnsContext,
  OppgaveColumnsDispatchContext,
  type OppgaveColumnsState,
  OppgaveColumnState,
} from './OppgaveColumnsContext.ts'

export interface OppgaveColumnsProviderProps {
  suffix: 'Mine' | 'Enhetens' | 'Medarbeiders'
  defaultColumns: DefaultOppgaveColumns
  children: ReactNode
}

export function OppgaveColumnsProvider(props: OppgaveColumnsProviderProps) {
  const { suffix, defaultColumns, children } = props
  const [state, dispatch] = useLocalReducer(
    'oppgaveColumns' + suffix,
    reducer,
    (storedState = []): OppgaveColumnsState => {
      const columnsById = associateBy(storedState, (it) => it.id)
      return defaultColumns
        .map((column, defaultOrder) => {
          const [id, defaultChecked] = Array.isArray(column) ? column : [column, true]
          const columnState = columnsById[id]
          return {
            id,
            checked: columnState?.checked ?? defaultChecked,
            defaultChecked,
            order: columnState?.order ?? defaultOrder,
            defaultOrder,
          }
        })
        .sort(byOrder)
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
    case 'addColumn':
      return state.map((column) => {
        return action.id === column.id ? { ...column, checked: true } : column
      })
    case 'removeColumn':
      return state.map((column) => {
        return action.id === column.id ? { ...column, checked: false } : column
      })
    case 'moveColumn': {
      const oldIndex = findColumnIndex(state, action.activeId)
      const newIndex = findColumnIndex(state, action.overId)
      return arrayMove([...state], oldIndex, newIndex).map((column, order) => ({
        ...column,
        order,
      }))
    }
    case 'resetAll':
      return state
        .map((column) => ({ ...column, checked: column.defaultChecked, order: column.defaultOrder }))
        .sort(byOrder)
    default:
      return state
  }
}

function byOrder(a: OppgaveColumnState, b: OppgaveColumnState): number {
  return a.order - b.order
}

function findColumnIndex(state: OppgaveColumnsState, id: UniqueIdentifier): number {
  return state.findIndex((column) => column.id === id)
}
