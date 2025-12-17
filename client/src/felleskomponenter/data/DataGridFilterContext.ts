import { createContext, type Dispatch, useCallback, useContext } from 'react'

import { type DataGridFilterValues } from './DataGridFilter.ts'

export type DataGridFilterState<K extends string = string> = Record<K, DataGridFilterValues>

export const DataGridFilterContext = createContext<DataGridFilterState>({})
export const DataGridFilterDispatch = createContext<Dispatch<DataGridFilterAction>>((state) => state)

export function useDataGridFilterContext<K extends string = string>(): DataGridFilterState<K> {
  return useContext(DataGridFilterContext)
}

export function useDataGridFilterDispatch(): Dispatch<DataGridFilterAction> {
  return useContext(DataGridFilterDispatch)
}

export function useDataGridFilterReset(field: string): (event: Event) => void {
  const dispatch = useDataGridFilterDispatch()
  return useCallback(() => {
    dispatch({
      type: 'reset',
      field,
    })
  }, [dispatch, field])
}

interface DataGridFilterBaseAction {
  type: 'checked' | 'unchecked' | 'reset'
  field: string
}

export interface DataGridFilterCheckedAction extends DataGridFilterBaseAction {
  type: 'checked'
  value: string
}

export interface DataGridFilterUncheckedAction extends DataGridFilterBaseAction {
  type: 'unchecked'
  value: string
}

export interface DataGridFilterResetAction extends DataGridFilterBaseAction {
  type: 'reset'
}

export type DataGridFilterAction =
  | DataGridFilterCheckedAction
  | DataGridFilterUncheckedAction
  | DataGridFilterResetAction
