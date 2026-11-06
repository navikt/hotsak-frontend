import { useCallback, useState } from 'react'
import useSWR from 'swr'

import { type DataGridPaginationProps } from '../felleskomponenter/data/DataGrid.tsx'
import { type Pageable, type PageRequest } from '../felleskomponenter/Page.ts'
import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type Journalpost } from '../types/types.internal.ts'

export interface SideInfo {
  sluttpeker: string | null
  finnesNesteSide: boolean
  antall: number
  totaltAntall: number
}

export interface DokumentsøkRequest extends Partial<PageRequest> {
  fnr: string
  journalposttype?: string[]
  journalstatus?: string[]
  fraDato?: string
  tilDato?: string

  cursor?: string
}

export interface DokumentsøkResponse extends Pageable {
  journalposter: Journalpost[]
  cursor?: string
}

export function useDokumentsøk(
  request?: DokumentsøkRequest,
  configuration: { keepPreviousData: boolean } = { keepPreviousData: true }
) {
  const [pageCursors, setPageCursors] = useState<Map<number, string | undefined>>(() => new Map([[1, request?.cursor]]))

  const { data, ...rest } = useSWR<DokumentsøkResponse, HttpError, () => [string, DokumentsøkRequest] | null>(
    () => (request?.fnr && pageCursors.has(request?.pageNumber ?? 1) ? ['/api/dokumenter/sok', request] : null),
    async ([url, body]) =>
      http.post<DokumentsøkRequest, DokumentsøkResponse>(url, {
        ...body,
        cursor: pageCursors.get(body.pageNumber ?? 1),
      }),
    {
      ...configuration,
      onSuccess(data) {
        if (!data.hasNext || !data.cursor) return
        setPageCursors((currentState) => {
          const newState = new Map(currentState)
          newState.set(data.pageNumber + 1, data.cursor)
          return newState
        })
      },
    }
  )

  const pagination: DataGridPaginationProps = {
    pageNumber: data?.pageNumber,
    pageSize: data?.pageSize,
    totalPages: data?.totalPages,
  }

  const reset = useCallback(() => setPageCursors(new Map([[1, request?.cursor]])), [request?.cursor])

  return {
    journalposter: data?.journalposter ?? ingenJournalposter,
    pagination,
    totalElements: data?.totalElements ?? 0,
    reset,
    ...rest,
  }
}

const ingenJournalposter: never[] = []
