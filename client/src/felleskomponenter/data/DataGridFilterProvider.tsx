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

function reducer(state: DataGridFilterState, action: DataGridFilterAction) {
  let current = state[action.columnKey]
  switch (action.type) {
    case 'checked':
      if (!current) {
        current = { values: [action.value] }
      } else {
        current = { values: [...current.values, action.value] }
      }
      return { ...state, [action.columnKey]: current }
    case 'unchecked':
      if (!current) {
        current = { values: [] }
      } else {
        current = { values: current.values.filter((value) => value !== action.value) }
      }
      return { ...state, [action.columnKey]: current }
    case 'clear':
      return { ...state, [action.columnKey]: { values: [] } }
    default:
      return state
  }
}
