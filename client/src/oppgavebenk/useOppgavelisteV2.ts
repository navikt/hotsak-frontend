import useSwr from 'swr'

import { SortState } from '@navikt/ds-react'
import { httpGet } from '../io/http'
import { FinnOppgaverResponse, OppgaveTildeltFilter, OppgaveV2 } from '../oppgave/oppgaveTypes.ts'

const PAGE_SIZE = 50

interface DataResponse {
  oppgaver: OppgaveV2[]
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
  queryParams: QueryParam[]
}

interface Filters {
  tildeltFilter: string
  gjelderFilter: string[]
}

interface QueryParam {
  key: string
  value: string
}

const pathConfig = (currentPage: number, sort: SortState, filters: Filters): PathConfigType => {
  const { tildeltFilter, gjelderFilter } = filters
  const sortDirection = sort.direction === 'ascending' ? 'ASC' : 'DESC'

  const queryParams: QueryParam[] = [
    { key: 'sorteringsfelt', value: sort.orderBy },
    { key: 'sorteringsrekkefølge', value: sortDirection },
    { key: 'limit', value: PAGE_SIZE.toString() },
    { key: 'page', value: currentPage.toString() },
  ]

  if (gjelderFilter.length > 0) {
    gjelderFilter.forEach((filter) => {
      queryParams.push({ key: 'gjelder', value: filter })
    })
  }

  if (tildeltFilter && tildeltFilter !== OppgaveTildeltFilter.ALLE) {
    queryParams.push({ key: 'tildelt', value: tildeltFilter })
  }

  return {
    path: `${basePath}`,
    queryParams: queryParams,
  }
}

const buildQueryParamString = (queryParams: QueryParam[]) => {
  return queryParams
    .map((queryParam) => `${encodeURIComponent(queryParam.key)}=${encodeURIComponent(queryParam.value)}`)
    .join('&')
}

export function useOppgavelisteV2(currentPage: number, sort: SortState, filters: Filters): DataResponse {
  const { path, queryParams } = pathConfig(currentPage, sort, filters)
  const fullPath = `${path}?${buildQueryParamString(queryParams)}`
  const { data, error, mutate } = useSwr<{ data: FinnOppgaverResponse }>(fullPath, httpGet, { refreshInterval: 10000 })

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
