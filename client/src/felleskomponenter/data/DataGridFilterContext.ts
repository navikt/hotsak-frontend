import { createContext, type Dispatch, useCallback, useContext, useMemo } from 'react'

import { type DataGridFilterValue, type DataGridFilterValues } from './DataGridFilter.ts'

/**
 * @typeParam K - column key
 */
export type DataGridColumnFilterState<K extends string = string> = Record<K, DataGridFilterValues>

/**
 * @typeParam S - scope key
 * @typeParam K - column key
 */
export type DataGridFilterState<S extends string = string, K extends string = string> = Record<
  S,
  DataGridColumnFilterState<K>
>

export const DataGridFilterContext = createContext<DataGridFilterState>({ global: {} })
export const DataGridFilterDispatch = createContext<Dispatch<DataGridFilterAction>>((state) => state)

export function useDataGridFilterContext<K extends string = string>(scope = 'global'): DataGridColumnFilterState<K> {
  return useContext(DataGridFilterContext)[scope] ?? {}
}

export function useDataGridFilterDispatch<K extends string = string>(): Dispatch<DataGridFilterAction<K>> {
  return useContext(DataGridFilterDispatch)
}

export function useDataGridFilterResetHandler(field: string, scope = 'global'): () => void {
  const dispatch = useDataGridFilterDispatch()
  return useCallback(() => {
    dispatch({
      type: 'resetField',
      scope,
      field,
    })
  }, [dispatch, field, scope])
}

export function useDataGridFilterResetAllHandler(scope = 'global'): () => void {
  const dispatch = useDataGridFilterDispatch()
  return useCallback(() => {
    dispatch({
      type: 'resetAll',
      scope,
    })
  }, [dispatch, scope])
}

export function useIsDataGridFiltered(scope = 'global'): boolean {
  const filterState = useDataGridFilterContext(scope)
  return useMemo(() => isDataGridFiltered(filterState), [filterState])
}

function isDataGridFiltered(state: DataGridColumnFilterState): boolean {
  const entries = Object.values(state).filter(({ values }) => values.size > 0)
  return entries.length > 0
}

interface DataGridFilterBaseAction<S extends string = string> {
  type: 'addFieldValue' | 'removeFieldValue' | 'resetField' | 'resetAll'
  scope: S
}

interface DataGridFilterFieldAction<
  S extends string = string,
  K extends string = string,
> extends DataGridFilterBaseAction<S> {
  field: K
}

export interface DataGridFilterAddFieldValueAction<
  S extends string = string,
  K extends string = string,
> extends DataGridFilterFieldAction<S, K> {
  type: 'addFieldValue'
  value: DataGridFilterValue
}

export interface DataGridFilterRemoveFieldValueAction<
  S extends string = string,
  K extends string = string,
> extends DataGridFilterFieldAction<S, K> {
  type: 'removeFieldValue'
  value: DataGridFilterValue
}

export interface DataGridFilterResetFieldAction<
  S extends string = string,
  K extends string = string,
> extends DataGridFilterFieldAction<S, K> {
  type: 'resetField'
}

export interface DataGridFilterResetAllAction<S extends string = string> extends DataGridFilterBaseAction<S> {
  type: 'resetAll'
}

export type DataGridFilterAction<S extends string = string, K extends string = string> =
  | DataGridFilterAddFieldValueAction<S, K>
  | DataGridFilterRemoveFieldValueAction<S, K>
  | DataGridFilterResetFieldAction<S, K>
  | DataGridFilterResetAllAction<S>
