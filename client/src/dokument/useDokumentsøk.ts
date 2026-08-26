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
  fraDato?: string
  tilDato?: string
}
export interface DokumentsøkResponse {
  journalposter: Journalpost[]
  sideInfo?: SideInfo
}

export interface useDokumentsøkResponse extends Omit<SWRResponse<DokumentsøkResponse>, 'data'> {
  journalposter: Journalpost[]
  sideInfo?: SideInfo
}

type DokumentsøkKey = [string, string, number, string | null, string | undefined, string | undefined] | null

export function useDokumentsøk({
  fnr,
  første = 100,
  etter = null,
  fraDato,
  tilDato,
}: {
  fnr?: string
  første?: number
  etter?: string | null
  fraDato?: string
  tilDato?: string
}): useDokumentsøkResponse {
  const { data, ...rest } = useSWR<DokumentsøkResponse, unknown, DokumentsøkKey>(
    fnr ? ['/api/dokumenter/sok', fnr, første, etter, fraDato, tilDato] : null,
    ([url, fnr, første, etter, fraDato, tilDato]) =>
      http.post<DokumentsøkRequest, DokumentsøkResponse>(url, { fnr, første, etter, fraDato, tilDato })
  )
  return {
    journalposter: data?.journalposter ?? [],
    sideInfo: data?.sideInfo,
    ...rest,
  }
}
