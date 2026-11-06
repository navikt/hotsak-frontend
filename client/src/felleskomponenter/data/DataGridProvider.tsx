import { useReducer, type ReactNode } from 'react'

import {
  DataGridContext,
  DataGridDispatch,
  DEFAULT_PAGE_SIZE,
  type DataGridAction,
  type DataGridSortState,
  type DataGridState,
} from './DataGridContext.ts'

export interface DataGridProviderProps extends DataGridSortState {
  children: ReactNode
}

export function DataGridProvider(props: DataGridProviderProps) {
  const { children, orderBy, direction } = props
  const [state, dispatch] = useReducer(reducer, {
    pageNumber: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    sort: { orderBy, direction },
  })
  return (
    <DataGridContext value={state}>
      <DataGridDispatch value={dispatch}>{children}</DataGridDispatch>
    </DataGridContext>
  )
}

function reducer(state: DataGridState, action: DataGridAction): DataGridState {
  console.log(state, action)
  switch (action.type) {
    case 'changePageNumber':
      return { ...state, pageNumber: action.pageNumber }
    case 'changePageSize':
      return { ...state, pageSize: action.pageSize }
    default:
      return state
  }
}
