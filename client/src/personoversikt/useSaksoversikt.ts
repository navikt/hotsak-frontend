import useSwr, { SWRResponse } from 'swr'

import { http } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import { BehandlingstatusType, Saksoversikt, Sakstype } from '../types/types.internal.ts'

export interface HentSaksoversiktRequest {
  fnr: string
  sakstype?: Sakstype
  behandlingsstatus?: BehandlingstatusType
}

type UseSaksoversiktKey = [string, string, Sakstype | undefined, BehandlingstatusType | undefined] | null

export interface UseSaksoversiktResponse extends Omit<SWRResponse<Saksoversikt, HttpError>, 'data'> {
  saksoversikt?: Saksoversikt
}

export function useSaksoversikt(
  fnr?: string,
  sakstype?: Sakstype,
  behandlingsstatus?: BehandlingstatusType
): UseSaksoversiktResponse {
  const { data: saksoversikt, ...rest } = useSwr<Saksoversikt, HttpError, UseSaksoversiktKey>(
    fnr ? ['/api/saksoversikt', fnr, sakstype, behandlingsstatus] : null,
    ([url, fnr, sakstype, behandlingsstatus]) =>
      http.post<HentSaksoversiktRequest, Saksoversikt>(url, { fnr, sakstype, behandlingsstatus })
  )
  return {
    saksoversikt,
    ...rest,
  }
}
