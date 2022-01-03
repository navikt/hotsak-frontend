import useSwr from 'swr'
import { httpGet } from '../io/http'

import { Oppgave, OppgaveStatusType, SortBy } from '../types/types.internal'
import { TabType } from './tabs'
import { PAGE_SIZE } from './paging/Pagination'

interface DataResponse {
  oppgaver: Oppgave[]
  totalCount: number
  currentPage: number
  pageSize: number
  isLoading: boolean
  isError: any
}

const basePath = 'api'

interface PathConfigType {
  path: string
  queryParams: Object
}

interface OppgavelisteResponse {
  oppgaver: Oppgave[]
  totalCount: number
  pageSize: number
  currentPage: number
}

const pathConfig = (type: TabType, currentPage: number, sortBy: SortBy): PathConfigType => {
  const pagingParams = { limit: PAGE_SIZE, page: currentPage }
  const sortParams = { sort_by: `${sortBy.label}.${sortBy.sortOrder}` }

  switch (type) {
    case TabType.Ufordelte:
      return {
        path: `${basePath}/oppgaver`,
        queryParams: { ...pagingParams, ...sortParams, status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER },
      }
    case TabType.Mine:
      return { path: `${basePath}/oppgaver/mine`, queryParams: { ...pagingParams, ...sortParams } }
    case TabType.Ferdigstilte:
      return {
        path: `${basePath}/oppgaver`,
        queryParams: { ...pagingParams, ...sortParams, status: OppgaveStatusType.VEDTAK_FATTET },
      }
    case TabType.OverførtGosys:
      return {
        path: `${basePath}/oppgaver`,
        queryParams: { ...pagingParams, ...sortParams, status: OppgaveStatusType.SENDT_GOSYS },
      }
    case TabType.Alle:
    default:
      return { path: `${basePath}/oppgaver`, queryParams: { ...pagingParams, ...sortParams } }
  }
}

const buildQueryParamString = (queryParams: Object) => {
  return Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
}

export function useOppgaveliste(type: TabType, currentPage: number, sortBy: SortBy): DataResponse {
  const { path, queryParams } = pathConfig(type, currentPage, sortBy)
  const fullPath = `${path}?${buildQueryParamString(queryParams)}`
  const { data, error } = useSwr<{ data: OppgavelisteResponse }>(fullPath, httpGet)

  return {
    oppgaver: data?.data.oppgaver || [],
    totalCount: data?.data.totalCount || 0,
    pageSize: data?.data.pageSize || PAGE_SIZE,
    currentPage: data?.data.currentPage || currentPage,
    isLoading: !error && !data,
    isError: error,
  }
}
