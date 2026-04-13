import { type ReactNode } from 'react'

import { useLocalReducer } from '../../state/useLocalReducer.ts'
import { DataGridFilterValue, type DataGridFilterValues } from './DataGridFilter.ts'
import {
  DataGridColumnFilterState,
  type DataGridFilterAction,
  DataGridFilterContext,
  DataGridFilterDispatch,
  type DataGridFilterState,
} from './DataGridFilterContext.ts'

export interface DataGridFilterProviderProps {
  suffix: string
  children: ReactNode
}

export function DataGridFilterProvider(props: DataGridFilterProviderProps) {
  const { suffix, children } = props
  const [state, dispatch] = useLocalReducer('dataGridFilter' + suffix, reducer, (storedState) => {
    const initialState: DataGridFilterState = { global: {} }
    if (storedState == null) return initialState
    return Object.entries(storedState).reduce((state, [scope, storedScopedState]) => {
      // hvis values er satt tyder dette på at scope i virkeligheten er et filter, ignorer
      if (storedScopedState.values) {
        return state
      }
      state[scope] = Object.entries(storedScopedState).reduce<DataGridColumnFilterState>(
        (scopedState, [field, values]) => {
          if (Array.isArray(values?.values)) {
            scopedState[field] = { values: new Set(values.values) }
          }
          return scopedState
        },
        {}
      )
      return state
    }, initialState)
  })
  return (
    <DataGridFilterContext value={state}>
      <DataGridFilterDispatch value={dispatch}>{children}</DataGridFilterDispatch>
    </DataGridFilterContext>
  )
}

function reducer(state: DataGridFilterState, action: DataGridFilterAction): DataGridFilterState {
  const scope = action.scope
  if (action.type === 'resetAll') {
    return { ...state, [scope]: {} }
  }
  const scopedState = state[scope]
  let current = scopedState?.[action.field]
  switch (action.type) {
    case 'addFieldValue': {
      if (!current) {
        current = filterValuesOf([action.value])
      } else {
        current = filterValuesOf([...current.values, action.value])
      }
      return { ...state, [scope]: { ...scopedState, [action.field]: current } }
    }
    case 'removeFieldValue': {
      if (!current) {
        current = emptyFilterValues()
      } else {
        current = filterValuesOf([...current.values].filter((value) => value !== action.value))
      }
      return { ...state, [scope]: { ...scopedState, [action.field]: current } }
    }
    case 'resetField': {
      return { ...state, [scope]: { ...scopedState, [action.field]: emptyFilterValues() } }
    }
    default: {
      return state
    }
  }
}

function emptyFilterValues<T extends DataGridFilterValue>(): DataGridFilterValues<T> {
  return { values: new Set() }
}

function filterValuesOf<T extends DataGridFilterValue>(values: Iterable<T>): DataGridFilterValues<T> {
  return { values: new Set([...values]) }
}
