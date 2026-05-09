import useSWR, { type SWRResponse } from 'swr'
import { http } from '../io/HttpClient.ts'

import type { Journalpost } from '../types/types.internal.ts'

export interface DokumentsøkRequest {
  fnr: string
}

export interface DokumentsøkResponse {
  journalposter: Journalpost[]
}

export interface useDokumentsøkResponse extends Omit<SWRResponse<DokumentsøkResponse>, 'data'> {
  journalposter: Journalpost[]
}

type DokumentsøkKey = [string, string] | null

export function useDokumentsøk({ fnr }: { fnr?: string }): useDokumentsøkResponse {
  const { data: journalposter = ingenJournalposter, ...rest } = useSWR<DokumentsøkResponse, unknown, DokumentsøkKey>(
    fnr ? ['/api/dokumenter/sok', fnr] : null,
    ([url, fnr]) => http.post<DokumentsøkRequest, DokumentsøkResponse>(url, { fnr })
  )
  return { ...journalposter, ...rest }
}

const ingenJournalposter: DokumentsøkResponse = { journalposter: [] }
