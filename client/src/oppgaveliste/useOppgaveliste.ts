import { useEffect } from 'react'
import useSwr from 'swr'

import { SortState } from '@navikt/ds-react'

import { httpGet } from '../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

import { OmrådeFilter, Oppgave, OppgaveStatusType, SakerFilter, SakstypeFilter } from '../types/types.internal'
import { PAGE_SIZE } from './paging/Paging'

interface DataResponse {
  oppgaver: Oppgave[]
  totalCount: number
  currentPage: number
  pageSize: number
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

interface Filters {
  sakerFilter: string
  statusFilter: string
  sakstypeFilter: string
  områdeFilter: string
}

interface OppgavelisteResponse {
  oppgaver: Oppgave[]
  totalCount: number
  currentPage: number
  pageSize: number
  antallHaster: number
}

function pathConfig(currentPage: number, sort: SortState, filters: Filters): PathConfigType {
  const sortDirection = sort.direction === 'ascending' ? 'ASC' : 'DESC'
  const pagingParams = { limit: PAGE_SIZE, page: currentPage }
  const sortParams = { sort_by: `${sort.orderBy}.${sortDirection}` }
  const { sakerFilter, statusFilter, sakstypeFilter, områdeFilter } = filters

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

export function useOppgaveliste(currentPage: number, sort: SortState, filters: Filters): DataResponse {
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
    totalCount: data?.data.totalCount || 0,
    currentPage: data?.data.currentPage || currentPage,
    pageSize: data?.data.pageSize || PAGE_SIZE,
    antallHaster: data?.data.antallHaster || 0,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
