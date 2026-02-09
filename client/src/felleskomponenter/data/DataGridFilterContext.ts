import { createContext, type Dispatch, useCallback, useContext, useMemo } from 'react'

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

export function useDataGridFilterResetHandler(field: string): () => void {
  const dispatch = useDataGridFilterDispatch()
  return useCallback(() => {
    dispatch({
      type: 'reset',
      field,
    })
  }, [dispatch, field])
}

export function useDataGridFilterResetAllHandler(): () => void {
  const dispatch = useDataGridFilterDispatch()
  return useCallback(() => {
    dispatch({
      type: 'resetAll',
    })
  }, [dispatch])
}

export function useIsDataGridFiltered(): boolean {
  const filterState = useDataGridFilterContext()
  return useMemo(() => {
    const entries = Object.values(filterState).filter(({ values }) => values.size > 0)
    return entries.length > 0
  }, [filterState])
}

interface DataGridFilterBaseAction {
  type: 'addValue' | 'removeValue' | 'reset' | 'resetAll'
}

interface DataGridFilterFieldAction<K extends string = string> extends DataGridFilterBaseAction {
  field: K
}

export interface DataGridFilterAddValueAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'addValue'
  value: string
}

export interface DataGridFilterRemoveValueAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'removeValue'
  value: string
}

export interface DataGridFilterResetAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'reset'
}

export interface DataGridFilterResetAllAction extends DataGridFilterBaseAction {
  type: 'resetAll'
}

export type DataGridFilterAction =
  | DataGridFilterAddValueAction
  | DataGridFilterRemoveValueAction
  | DataGridFilterResetAction
  | DataGridFilterResetAllAction
