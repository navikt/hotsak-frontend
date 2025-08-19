import { SortState } from '@navikt/ds-react'
import useSwr, { KeyedMutator } from 'swr'

import { OppgaveV1, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { OmrådeFilter, OppgaveStatusType, SakerFilter, SakstypeFilter } from '../../types/types.internal.ts'

const PAGE_SIZE = 50

interface DataResponse {
  oppgaver: OppgaveV1[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
  antallHaster: number
  isLoading: boolean
  error: unknown
  mutate: KeyedMutator<OppgavelisteResponse>
}

const basePath = '/api/oppgaver'

type QueryParams = Record<string, boolean | number | string>

interface PathConfigType {
  path: string
  queryParams: QueryParams
}

export interface OppgavelisteFilters {
  statuskategori?: Statuskategori
  sakerFilter: SakerFilter
  statusFilter: OppgaveStatusType
  sakstypeFilter: SakstypeFilter
  områdeFilter: OmrådeFilter
  hasteToggle: boolean
}

export type OppgavelisteFiltersKey = keyof OppgavelisteFilters

export interface OppgavelisteResponse {
  oppgaver: OppgaveV1[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
  antallHaster: number
}

function pathConfig(currentPage: number, sort: SortState, filters: OppgavelisteFilters): PathConfigType {
  const sortDirection = sort.direction === 'ascending' ? 'ASC' : 'DESC'
  const pagingParams = { limit: PAGE_SIZE, page: currentPage }
  const sortParams = { sort_by: `${sort.orderBy}.${sortDirection}` }
  const { statuskategori, sakerFilter, statusFilter, sakstypeFilter, områdeFilter, hasteToggle } = filters

  const filterParams: QueryParams = {
    statuskategori: statuskategori ?? Statuskategori.ÅPEN,
  }
  if (sakerFilter && sakerFilter !== SakerFilter.ALLE) {
    filterParams.saksbehandler = sakerFilter
  }
  if (statusFilter && statusFilter !== OppgaveStatusType.ALLE) {
    filterParams.status = statusFilter
  }
  if (sakstypeFilter && sakstypeFilter !== SakstypeFilter.ALLE) {
    filterParams.type = sakstypeFilter
  }
  if (områdeFilter && områdeFilter !== OmrådeFilter.ALLE) {
    filterParams.område = områdeFilter
  }
  if (hasteToggle) {
    filterParams.hast = hasteToggle
  }

  return {
    path: `${basePath}`,
    queryParams: { ...pagingParams, ...sortParams, ...filterParams },
  }
}

function buildQueryParamString(queryParams: QueryParams) {
  return Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export function useOppgavelisteV1(currentPage: number, sort: SortState, filters: OppgavelisteFilters): DataResponse {
  const { path, queryParams } = pathConfig(currentPage, sort, filters)
  const fullPath = `${path}?${buildQueryParamString(queryParams)}`
  const { data, error, mutate, isLoading } = useSwr<OppgavelisteResponse>(fullPath, {
    refreshInterval: 10000,
  })

  if (!data) {
    return {
      oppgaver: [],
      pageNumber: currentPage,
      pageSize: PAGE_SIZE,
      totalPages: 0,
      totalElements: 0,
      antallHaster: 0,
      isLoading,
      error,
      mutate,
    }
  }

  return {
    ...data,
    isLoading,
    error,
    mutate,
  }
}
