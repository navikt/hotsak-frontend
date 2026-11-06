import useSWR from 'swr'

import { type DataGridPaginationProps } from '../felleskomponenter/data/DataGrid.tsx'
import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type FinnOppgaverRequest, type FinnOppgaverResponse } from './oppgaveTypes.ts'

export function useOppgavesøk(
  request?: FinnOppgaverRequest,
  configuration: { keepPreviousData: boolean } = { keepPreviousData: true }
) {
  const { data, ...rest } = useSWR<FinnOppgaverResponse, HttpError, () => [string, FinnOppgaverRequest] | null>(
    () => (request ? ['/api/oppgaver/sok', request] : null),
    ([url, body]) => http.post<FinnOppgaverRequest, FinnOppgaverResponse>(url, body),
    { ...configuration }
  )

  const pagination: DataGridPaginationProps = {
    pageNumber: data?.pageNumber,
    pageSize: data?.pageSize,
    totalPages: data?.totalPages,
  }

  return {
    data,
    pagination,
    totalElements: data?.totalElements ?? 0,
    ...rest,
  }
}

// const ingenOppgaver: never[] = []
