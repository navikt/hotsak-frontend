import { createContext, type Dispatch, type EventHandler, useCallback, useContext, useMemo } from 'react'

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

export function useDataGridFilterReset(field: string): EventHandler<any> {
  const dispatch = useDataGridFilterDispatch()
  return useCallback(() => {
    dispatch({
      type: 'reset',
      field,
    })
  }, [dispatch, field])
}

export function useDataGridFilterResetAll(): EventHandler<any> {
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
  type: 'checked' | 'unchecked' | 'reset' | 'resetAll'
}

interface DataGridFilterFieldAction<K extends string = string> extends DataGridFilterBaseAction {
  field: K
}

export interface DataGridFilterCheckedAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'checked'
  value: string
}

export interface DataGridFilterUncheckedAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'unchecked'
  value: string
}

export interface DataGridFilterResetAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'reset'
}

export interface DataGridFilterResetAllAction extends DataGridFilterBaseAction {
  type: 'resetAll'
}

export type DataGridFilterAction =
  | DataGridFilterCheckedAction
  | DataGridFilterUncheckedAction
  | DataGridFilterResetAction
  | DataGridFilterResetAllAction
