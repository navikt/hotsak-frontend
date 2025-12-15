import { type ReactNode, useReducer } from 'react'

import {
  type DataGridFilterAction,
  DataGridFilterContext,
  DataGridFilterDispatch,
  type DataGridFilterState,
} from './DataGridFilterContext.ts'

export interface DataGridFilterProviderProps {
  children: ReactNode
}

export function DataGridFilterProvider(props: DataGridFilterProviderProps) {
  const { children } = props
  const [state, dispatch] = useReducer(reducer, {})
  return (
    <DataGridFilterContext value={state}>
      <DataGridFilterDispatch value={dispatch}>{children}</DataGridFilterDispatch>
    </DataGridFilterContext>
  )
}

function reducer(state: DataGridFilterState, action: DataGridFilterAction): DataGridFilterState {
  let current = state[action.field]
  switch (action.type) {
    case 'checked':
      if (!current) {
        current = { values: new Set([action.value]) }
      } else {
        current = { values: new Set([...current.values, action.value]) }
      }
      return { ...state, [action.field]: current }
    case 'unchecked':
      if (!current) {
        current = { values: new Set() }
      } else {
        current = { values: new Set([...current.values].filter((value) => value !== action.value)) }
      }
      return { ...state, [action.field]: current }
    case 'clear':
      return { ...state, [action.field]: { values: new Set() } }
    default:
      return state
  }
}
