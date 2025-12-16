import { createContext, type Dispatch, useContext } from 'react'

import { type DataGridFilterValues } from './DataGridFilter.ts'

export type DataGridFilterState<K extends string = string> = Record<K, DataGridFilterValues>

export const DataGridFilterContext = createContext<DataGridFilterState>({})
export const DataGridFilterDispatch = createContext<Dispatch<DataGridFilterAction>>((state) => state)

export function useDataGridFilterContext<K extends string = string>(): DataGridFilterState<K> {
  return useContext(DataGridFilterContext)
}

export function useDataGridFilterDispatch() {
  return useContext(DataGridFilterDispatch)
}

interface DataGridFilterBaseAction {
  type: 'checked' | 'unchecked' | 'clear'
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

export interface DataGridFilterClearAction extends DataGridFilterBaseAction {
  type: 'clear'
}

export type DataGridFilterAction =
  | DataGridFilterCheckedAction
  | DataGridFilterUncheckedAction
  | DataGridFilterClearAction
