import { SortState } from '@navikt/ds-react'
import { useEffect } from 'react'
import useSwr from 'swr'

import { httpGet } from '../io/http'
import { OmrådeFilter, Oppgave, OppgaveStatusType, SakerFilter, SakstypeFilter } from '../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'
import { PAGE_SIZE } from './paging/Paging'

interface DataResponse {
  oppgaver: Oppgave[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
  antallHaster: number
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

const basePath = 'api/oppgaver'

interface PathConfigType {
  path: string
  queryParams: Record<string, string>
}

interface OppgavelisteFilters {
  sakerFilter: string
  statusFilter: string
  sakstypeFilter: string
  områdeFilter: string
  hasteToggle: boolean
}

export interface OppgavelisteResponse {
  oppgaver: Oppgave[]
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
  const { sakerFilter, statusFilter, sakstypeFilter, områdeFilter, hasteToggle } = filters

  const filterParams: any = {}

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

function buildQueryParamString(queryParams: Record<string, string>) {
  return Object.entries(queryParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

export function useOppgaveliste(currentPage: number, sort: SortState, filters: OppgavelisteFilters): DataResponse {
  const { path, queryParams } = pathConfig(currentPage, sort, filters)
  const fullPath = `${path}?${buildQueryParamString(queryParams)}`
  const { data, error, mutate } = useSwr<{ data: OppgavelisteResponse }>(fullPath, httpGet, { refreshInterval: 10000 })

  useEffect(() => {
    logAmplitudeEvent(amplitude_taxonomy.OPPGAVELISTE_OPPDATERT, {
      currentPage,
      ...sort,
      ...filters,
    })
  }, [currentPage, sort, filters])

  return {
    oppgaver: data?.data.oppgaver || [],
    pageNumber: data?.data.pageNumber || currentPage,
    pageSize: data?.data.pageSize || PAGE_SIZE,
    totalPages: data?.data.totalPages || 0,
    totalElements: data?.data.totalElements || 0,
    antallHaster: data?.data.antallHaster || 0,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
