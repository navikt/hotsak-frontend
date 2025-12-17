import { type ReactNode, useReducer } from 'react'

import {
  type DataGridFilterAction,
  DataGridFilterContext,
  DataGridFilterDispatch,
  type DataGridFilterState,
} from './DataGridFilterContext.ts'
import type { DataGridFilterValues } from './DataGridFilter.ts'

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
        current = filterValuesOf([action.value])
      } else {
        current = filterValuesOf([...current.values, action.value])
      }
      return { ...state, [action.field]: current }
    case 'unchecked':
      if (!current) {
        current = emptyFilterValues()
      } else {
        current = filterValuesOf([...current.values].filter((value) => value !== action.value))
      }
      return { ...state, [action.field]: current }
    case 'reset':
      return { ...state, [action.field]: emptyFilterValues() }
    default:
      return state
  }
}

function emptyFilterValues<T extends string = string>(): DataGridFilterValues<T> {
  return { values: new Set() }
}

function filterValuesOf<T extends string = string>(values: Iterable<T>): DataGridFilterValues<T> {
  return { values: new Set([...values]) }
}
