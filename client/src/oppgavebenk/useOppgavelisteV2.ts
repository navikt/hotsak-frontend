import useSwr from 'swr'

import { httpGet } from '../io/http'
import { PAGE_SIZE } from '../oppgaveliste/paging/Paging'
import { OppgaveApiOppgave, OppgaveApiResponse, OppgaveGjelderFilter } from '../types/experimentalTypes'

interface DataResponse {
  oppgaver: OppgaveApiOppgave[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

const basePath = 'api/oppgaver-v2'

interface PathConfigType {
  path: string
  queryParams: Record<string, string>
}

interface Filters {
  gjelderFilter: string
}

/*interface OppgavelisteResponse {
  oppgaver: OppgaveApiOppgave[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
}*/

const pathConfig = (/*currentPage: number, sort: SortState, */ filters: Filters): PathConfigType => {
  //const sortDirection = sort.direction === 'ascending' ? 'ASC' : 'DESC'
  //const pagingParams = { limit: PAGE_SIZE, page: currentPage }
  //const sortParams = { sort_by: `${sort.orderBy}.${sortDirection}` }
  const { gjelderFilter } = filters

  const filterParams: any = {}

  if (gjelderFilter && gjelderFilter !== OppgaveGjelderFilter.ALLE) {
    filterParams.gjelder = gjelderFilter
  }

  return {
    path: `${basePath}`,
    queryParams: { /*...pagingParams, ...sortParams, */ ...filterParams },
  }
}

const buildQueryParamString = (queryParams: Record<string, string>) => {
  return Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export function useOppgavelisteV2(currentPage: number, /*, sort: SortState,*/ filters: Filters): DataResponse {
  const { path, queryParams } = pathConfig(/*currentPage, sort,*/ filters)
  const fullPath = `${path}?${buildQueryParamString(queryParams)}`
  const { data, error, mutate } = useSwr<{ data: OppgaveApiResponse }>(fullPath, httpGet, { refreshInterval: 10000 })

  return {
    oppgaver: data?.data.oppgaver || [],
    pageNumber: data?.data.pageNumber || currentPage,
    pageSize: data?.data.pageSize || PAGE_SIZE,
    totalPages: data?.data.totalPages || 0,
    totalElements: data?.data.totalElements || 0,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
