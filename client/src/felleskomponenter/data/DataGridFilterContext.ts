import { createContext, type Dispatch, useCallback, useContext, useMemo } from 'react'

import { type DataGridFilterValue, type DataGridFilterValues, emptyDataGridFilterValues } from './DataGridFilter.ts'

export type DataGridFilterState<K extends string = string> = Record<K, DataGridFilterValues>

export const DataGridFilterContext = createContext<DataGridFilterState>({})
export const DataGridFilterDispatch = createContext<Dispatch<DataGridFilterAction>>((state) => state)

export function useDataGridFilterContext<K extends string = string>(): DataGridFilterState<K> {
  return useContext(DataGridFilterContext)
}

export function useDataGridFilterDispatch<K extends string = string>(): Dispatch<DataGridFilterAction<K>> {
  return useContext(DataGridFilterDispatch)
}

export function useDataGridFilterResetHandler(field: string): () => void {
  const dispatch = useDataGridFilterDispatch()
  return useCallback(() => {
    dispatch({
      type: 'resetField',
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
  return useMemo(() => isDataGridFiltered(filterState), [filterState])
}

export function useIsDataGridOnlyFilteredBy<
  K extends string = string,
  V extends DataGridFilterValue = DataGridFilterValue,
>(key: K, values: Set<V>) {
  const { [key]: filter = emptyDataGridFilterValues, ...rest } = useDataGridFilterContext<K>()
  return values.symmetricDifference(filter.values).size === 0 && !isDataGridFiltered(rest)
}

function isDataGridFiltered(state: DataGridFilterState): boolean {
  const entries = Object.values(state).filter(({ values }) => values.size > 0)
  return entries.length > 0
}

interface DataGridFilterBaseAction {
  type: 'addFieldValue' | 'removeFieldValue' | 'setFieldValues' | 'resetField' | 'resetAll'
}

interface DataGridFilterFieldAction<K extends string = string> extends DataGridFilterBaseAction {
  field: K
}

export interface DataGridFilterAddFieldValueAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'addFieldValue'
  value: DataGridFilterValue
}

export interface DataGridFilterRemoveFieldValueAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'removeFieldValue'
  value: DataGridFilterValue
}

export interface DataGridFilterSetFieldValueAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'setFieldValues'
  values: Iterable<DataGridFilterValue>
  resetOthers?: boolean
}

export interface DataGridFilterResetFieldAction<K extends string = string> extends DataGridFilterFieldAction<K> {
  type: 'resetField'
}

export interface DataGridFilterResetAllAction extends DataGridFilterBaseAction {
  type: 'resetAll'
}

export type DataGridFilterAction<K extends string = string> =
  | DataGridFilterAddFieldValueAction<K>
  | DataGridFilterRemoveFieldValueAction<K>
  | DataGridFilterSetFieldValueAction<K>
  | DataGridFilterResetFieldAction<K>
  | DataGridFilterResetAllAction

export function addFieldValueAction<K extends string = string>(
  field: K,
  value: DataGridFilterValue
): DataGridFilterAction<K> {
  return {
    type: 'addFieldValue',
    field,
    value,
  }
}

export function removeFieldValueAction<K extends string = string>(
  field: K,
  value: DataGridFilterValue
): DataGridFilterAction<K> {
  return {
    type: 'removeFieldValue',
    field,
    value,
  }
}
