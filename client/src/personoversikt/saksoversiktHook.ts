import useSwr from 'swr'

import { hentBrukerdataMedPost } from '../io/http'

import { BehandlingstatusType, Sakstype, Saksoversikt } from '../types/types.internal'

interface SaksoversiktResponse {
  saksoversikt: Saksoversikt | undefined
  isLoading: boolean
  isError: any
}

export function useSaksoversikt(
  fnr?: string,
  sakstype?: Sakstype,
  behandlingsstatus?: BehandlingstatusType
): SaksoversiktResponse {
  const { data, error } = useSwr<{ data: Saksoversikt }>(
    fnr ? ['api/saksoversikt', fnr, sakstype, behandlingsstatus] : null,
    hentBrukerdataMedPost
  )

  return {
    saksoversikt: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
