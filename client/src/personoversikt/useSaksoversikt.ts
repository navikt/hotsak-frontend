import useSwr, { SWRResponse } from 'swr'

import { http } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import type { SaksstatusKategori, Sakstype } from '../types/types.internal.ts'
import type { Saksoversikt } from './saksoversiktTypes.ts'

export interface HentSaksoversiktRequest {
  fnr: string
  statuskategori?: SaksstatusKategori
  sakstype?: Sakstype
}

type UseSaksoversiktKey = [string, string, SaksstatusKategori | undefined, Sakstype | undefined] | null

export interface UseSaksoversiktResponse extends Omit<SWRResponse<Saksoversikt, HttpError>, 'data'> {
  saksoversikt?: Saksoversikt
}

export function useSaksoversikt(
  fnr?: string,
  statuskategori?: SaksstatusKategori,
  sakstype?: Sakstype
): UseSaksoversiktResponse {
  const { data: saksoversikt, ...rest } = useSwr<Saksoversikt, HttpError, UseSaksoversiktKey>(
    fnr ? ['/api/saksoversikt', fnr, statuskategori, sakstype] : null,
    ([url, fnr, statuskategori, sakstype]) =>
      http.post<HentSaksoversiktRequest, Saksoversikt>(url, { fnr, statuskategori, sakstype })
  )
  return {
    saksoversikt,
    ...rest,
  }
}
