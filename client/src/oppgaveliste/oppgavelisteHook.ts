import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Oppgave, OppgaveStatusType } from '../types/types.internal'
import { TabType } from './tabs'

interface DataResponse {
  oppgaver: Oppgave[]
  isLoading: boolean
  isError: any
}

const basePath = 'api/oppgaver'
const pageSize = 25
const inialPage = 1
const defaultQueryParams = { "limit": pageSize, "page": inialPage }

interface PathConfigType {
  path: string
  queryParams: Object
}

const pathConfig = (type: TabType): PathConfigType => {
  switch (type) {
    case TabType.Ufordelte:
      return { path: basePath, queryParams: { ...defaultQueryParams, type: OppgaveStatusType.AVVENTER_SAKSBEHANDLER } }
    case TabType.Mine:
      return { path: `${basePath}/mine`, queryParams: { ...defaultQueryParams } }
    case TabType.Ferdigstilte:
      return { path: basePath, queryParams: { ...defaultQueryParams, type: OppgaveStatusType.VEDTAK_FATTET } }
    case TabType.OverførtGosys:
      return { path: basePath, queryParams: { ...defaultQueryParams, type: OppgaveStatusType.SENDT_GOSYS } }
    case TabType.Alle:
    default:
      return { path: basePath, queryParams: { ...defaultQueryParams } }
  }
}

const buildQueryParamString = (queryParams: Object) => {
  return Object.entries(queryParams).map(([key, value]) => `${key}=${value}`).join("&")
}

export function useOppgaveliste(type: TabType): DataResponse {
  const { path, queryParams } = pathConfig(type)
  const fullPath = `${path}?${buildQueryParamString(queryParams)}`
  const { data, error } = useSwr<{ data: Oppgave[] }>(fullPath, httpGet)

  return {
    oppgaver: data?.data || [],
    isLoading: !error && !data,
    isError: error,
  }
}
