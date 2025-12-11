import { createContext, type Dispatch, useContext } from 'react'

export type DataGridFilterState = Record<string, { values: string[] }>

export const DataGridFilterContext = createContext<DataGridFilterState>({})
export const DataGridFilterDispatch = createContext<Dispatch<DataGridFilterAction>>((state) => state)

export function useDataGridFilterContext() {
  return useContext(DataGridFilterContext)
}

export function useDataGridFilterDispatch() {
  return useContext(DataGridFilterDispatch)
}

interface DataGridFilterBaseAction {
  type: 'checked' | 'unchecked' | 'clear'
  columnKey: string
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
