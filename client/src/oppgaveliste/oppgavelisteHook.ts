import { SortState } from '@navikt/ds-react'
import useSwr from 'swr'
import { httpGet } from '../io/http'

import { OmrådeFilter, Oppgave, OppgaveStatusType, SakerFilter } from '../types/types.internal'
import { PAGE_SIZE } from './paging/Paging'

interface DataResponse {
  oppgaver: Oppgave[]
  totalCount: number
  currentPage: number
  pageSize: number
  isLoading: boolean
  isError: any
  mutate: Function
}

const basePath = 'api/oppgaver'

interface PathConfigType {
  path: string
  queryParams: Object
}

interface Filters {
  sakerFilter: string
  statusFilter: string
  områdeFilter: string
}

interface OppgavelisteResponse {
  oppgaver: Oppgave[]
  totalCount: number
  pageSize: number
  currentPage: number
}

const pathConfig = (currentPage: number, sort: SortState, filters: Filters): PathConfigType => {
    const pagingParams = { limit: PAGE_SIZE, page: currentPage }
  const sortParams = { sort_by: `${sort.orderBy}.${sort.direction}` }
  const { sakerFilter, statusFilter, områdeFilter } = filters




  let filterParams: any = {}

  if (sakerFilter && sakerFilter !== SakerFilter.ALLE) {
    filterParams.saksbehandler = sakerFilter
  }
  if (statusFilter && statusFilter !== OppgaveStatusType.ALLE) {
    filterParams.status = statusFilter
  }
  if (områdeFilter && områdeFilter !== OmrådeFilter.ALLE) {
    filterParams.område = områdeFilter
  }

  return {
    path: `${basePath}`,
    queryParams: { ...pagingParams, ...sortParams, ...filterParams },
  }
}

const buildQueryParamString = (queryParams: Object) => {
  return Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

export function useOppgaveliste(currentPage: number, sort: SortState, filters: Filters): DataResponse {
  const { path, queryParams } = pathConfig(currentPage, sort, filters)
  const fullPath = `${path}?${buildQueryParamString(queryParams)}`
  const { data, error, mutate } = useSwr<{ data: OppgavelisteResponse }>(fullPath, httpGet, {refreshInterval: 10000})

  return {
    oppgaver: data?.data.oppgaver || [],
    totalCount: data?.data.totalCount || 0,
    pageSize: data?.data.pageSize || PAGE_SIZE,
    currentPage: data?.data.currentPage || currentPage,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate
  }
}
