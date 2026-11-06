import { type SortState } from '@navikt/ds-react'
import { type ChangeEvent, createContext, type Dispatch, useCallback, useContext } from 'react'

export interface DataGridSortState<T extends string = string> extends SortState {
  orderBy: T | string
}

export interface DataGridState<T extends string = string> {
  pageNumber: number
  pageSize: number
  sort: DataGridSortState<T>
}

export const DEFAULT_PAGE_SIZE = 20

const initialState: DataGridState = {
  pageNumber: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  sort: { orderBy: '', direction: 'none' },
}

export const DataGridContext = createContext<DataGridState>(initialState)
export const DataGridDispatch = createContext<Dispatch<DataGridAction>>((state) => state)

export function useDataGridContext(): DataGridState {
  return useContext(DataGridContext)
}

export function useDataGridDispatch(): Dispatch<DataGridAction> {
  return useContext(DataGridDispatch)
}

export function useDataGridChangePageNumberHandler() {
  const dispatch = useDataGridDispatch()
  return useCallback(
    (pageNumber: number) =>
      dispatch({
        type: 'changePageNumber',
        pageNumber,
      }),
    [dispatch]
  )
}

export function useDataGridChangePageSizeHandler() {
  const dispatch = useDataGridDispatch()
  return useCallback(
    (event: ChangeEvent<HTMLSelectElement>) =>
      dispatch({
        type: 'changePageSize',
        pageSize: Number(event.target.value),
      }),
    [dispatch]
  )
}

interface DataGridBaseAction {
  type: 'changePageNumber' | 'changePageSize' | 'sort'
}

export interface DataGridChangePageNumberAction extends DataGridBaseAction {
  type: 'changePageNumber'
  pageNumber: number
}

export interface DataGridChangePageSizeAction extends DataGridBaseAction {
  type: 'changePageSize'
  pageSize: number
}

export interface DataGridSortAction extends DataGridBaseAction {
  type: 'sort'
}

export type DataGridAction = DataGridChangePageNumberAction | DataGridChangePageSizeAction | DataGridSortAction
