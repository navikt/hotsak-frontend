import useSwr, { type KeyedMutator } from 'swr'

import { createQueryString, type QueryParameters } from '../../io/HttpClient.ts'
import {
  type FinnOppgaverResponse,
  type OppgaveSortState,
  OppgaveTildeltFilter,
  type OppgaveV2,
} from '../../oppgave/oppgaveTypes.ts'

interface DataResponse {
  oppgaver: OppgaveV2[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
  isLoading: boolean
  error: unknown
  mutate: KeyedMutator<FinnOppgaverResponse>
}

const basePath = '/api/oppgaver-v2'

interface PathConfigType {
  path: string
  queryParams: QueryParameters
}

interface OppgaveFilters {
  tildeltFilter: string
  oppgavetypeFilter: string[]
  gjelderFilter: string[]
}

const pathConfig = (
  currentPage: number,
  pageSize: number,
  sort: OppgaveSortState,
  filters: OppgaveFilters
): PathConfigType => {
  const { tildeltFilter, oppgavetypeFilter, gjelderFilter } = filters
  const queryParams: QueryParameters = {
    tildelt: tildeltFilter === OppgaveTildeltFilter.ALLE ? undefined : tildeltFilter,
    oppgavetype: oppgavetypeFilter,
    gjelder: gjelderFilter,
    page: currentPage,
    limit: pageSize,
  }
  if (sort.orderBy === 'fristFerdigstillelse') {
    queryParams.sorteringsfelt = 'FRIST'
  }
  if (sort.orderBy === 'opprettetTidspunkt') {
    queryParams.sorteringsfelt = 'OPPRETTET_TIDSPUNKT'
  }
  if (queryParams.sorteringsfelt) {
    queryParams.sorteringsrekkefølge = sort.direction === 'ascending' ? 'ASC' : 'DESC'
  }
  return {
    path: `${basePath}`,
    queryParams: queryParams,
  }
}

export function useMineOppgaver(
  currentPage: number,
  pageSize: number,
  sort: OppgaveSortState,
  filters: OppgaveFilters
): DataResponse {
  const { path, queryParams } = pathConfig(currentPage, pageSize, sort, filters)
  const fullPath = `${path}?${createQueryString(queryParams)}`
  const { data, error, mutate, isLoading } = useSwr<FinnOppgaverResponse>(fullPath, {
    refreshInterval: 10_000,
  })

  if (!data) {
    return {
      oppgaver: [],
      pageNumber: currentPage,
      pageSize,
      totalPages: 0,
      totalElements: 0,
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
