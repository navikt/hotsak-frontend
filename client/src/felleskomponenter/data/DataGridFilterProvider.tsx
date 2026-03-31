import { type ReactNode } from 'react'

import { useLocalReducer } from '../../state/useLocalReducer.ts'
import { DataGridFilterValue, type DataGridFilterValues } from './DataGridFilter.ts'
import {
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
    const initialState: DataGridFilterState = {}
    if (storedState == null) return initialState
    return Object.entries(storedState).reduce((state, [field, values]) => {
      state[field] = { values: new Set(values.values) }
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
  if (action.type === 'resetAll') {
    return {}
  }
  let current = state[action.field]
  switch (action.type) {
    case 'addFieldValue': {
      if (!current) {
        current = filterValuesOf([action.value])
      } else {
        current = filterValuesOf([...current.values, action.value])
      }
      return { ...state, [action.field]: current }
    }
    case 'removeFieldValue': {
      if (!current) {
        current = emptyFilterValues()
      } else {
        current = filterValuesOf([...current.values].filter((value) => value !== action.value))
      }
      return { ...state, [action.field]: current }
    }
    case 'setFieldValues': {
      const values = filterValuesOf(action.values)
      if (action.resetOthers) {
        return { [action.field]: values }
      } else {
        return { ...state, [action.field]: values }
      }
    }
    case 'resetField': {
      return { ...state, [action.field]: emptyFilterValues() }
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
