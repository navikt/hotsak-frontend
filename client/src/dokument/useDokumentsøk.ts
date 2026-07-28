import useSWR, { type SWRResponse } from 'swr'
import { http } from '../io/HttpClient.ts'

import type { Journalpost } from '../types/types.internal.ts'

export interface SideInfo {
  sluttpeker: string | null
  finnesNesteSide: boolean
  antall: number
  totaltAntall: number
}

export interface DokumentsøkRequest {
  fnr: string
  første?: number
  etter?: string | null
}
export interface DokumentsøkResponse {
  journalposter: Journalpost[]
  sideInfo?: SideInfo
}

export interface useDokumentsøkResponse extends Omit<SWRResponse<DokumentsøkResponse>, 'data'> {
  journalposter: Journalpost[]
  sideInfo?: SideInfo
}

type DokumentsøkKey = [string, string, number, string | null] | null

export function useDokumentsøk({
  fnr,
  første = 100,
  etter = null,
}: {
  fnr?: string
  første?: number
  etter?: string | null
}): useDokumentsøkResponse {
  const { data, ...rest } = useSWR<DokumentsøkResponse, unknown, DokumentsøkKey>(
    fnr ? ['/api/dokumenter/sok', fnr, første, etter] : null,
    ([url, fnr, første, etter]) => http.post<DokumentsøkRequest, DokumentsøkResponse>(url, { fnr, første, etter })
  )
  return {
    journalposter: data?.journalposter ?? [],
    sideInfo: data?.sideInfo,
    ...rest,
  }
}
