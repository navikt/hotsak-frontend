import useSwr from 'swr'

import { hentBrukerdataMedPost } from '../io/http'

import { BehandlingstatusType, Sakstype, Saksoversikt } from '../types/types.internal'

interface SaksoversiktResponse {
  saksoversikt: Saksoversikt | undefined
  isLoading: boolean
  isError: any
}

export function useSaksoversikt(
  brukersFodselsnummer?: string,
  saksType?: Sakstype,
  behandlingsStatus?: BehandlingstatusType
): SaksoversiktResponse {
  const { data, error } = useSwr<{ data: Saksoversikt }>(
    brukersFodselsnummer ? ['api/saksoversikt', brukersFodselsnummer, saksType, behandlingsStatus] : null,
    hentBrukerdataMedPost
  )

  return {
    saksoversikt: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
