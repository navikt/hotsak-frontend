import { type UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { type ReactNode } from 'react'

import { useLocalReducer } from '../state/useLocalReducer.ts'
import { associateBy } from '../utils/array.ts'
import { type DefaultOppgaveColumns, getOppgaveColumn, OppgaveColumnField } from './oppgaveColumns.tsx'
import {
  type OppgaveColumnsAction,
  OppgaveColumnsContext,
  OppgaveColumnsDispatchContext,
  type OppgaveColumnsState,
  OppgaveColumnState,
} from './OppgaveColumnsContext.ts'
import { useMiljø } from '../utils/useMiljø.ts'

export interface OppgaveColumnsProviderProps {
  suffix: 'Mine' | 'Enhetens' | 'Medarbeiders'
  defaultColumns: DefaultOppgaveColumns
  children: ReactNode
}

export function OppgaveColumnsProvider(props: OppgaveColumnsProviderProps) {
  const { suffix, defaultColumns, children } = props
  const { erIkkeProd } = useMiljø()
  const [state, dispatch] = useLocalReducer(
    'oppgaveColumns' + suffix,
    reducer,
    (storedState = []): OppgaveColumnsState => {
      const columnsById = associateBy(storedState, (it) => it.id)
      return defaultColumns
        .filter((column) => {
          const [id] = asTuple(column)
          const { experiment } = getOppgaveColumn(id)
          return !experiment || erIkkeProd
        })
        .map((column, defaultOrder) => {
          const [id, defaultChecked] = asTuple(column)
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

function asTuple(column: OppgaveColumnField | [OppgaveColumnField, boolean]): [OppgaveColumnField, boolean] {
  return Array.isArray(column) ? column : [column, true]
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
