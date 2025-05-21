import useSwr from 'swr'

import { httpGet } from '../../../io/http'
import { Hendelse } from '../../../types/types.internal'
import { useSortering } from '../../../utils/useSortering'
import { sorterKronologiskSynkende } from '../../../utils/dato'
import { useSakId } from '../../useSak.ts'

interface DataResponse {
  hendelser: ReadonlyArray<Hendelse>
  error: any
  isLoading: boolean
}

export function useSakshistorikk(): DataResponse {
  const sakId = useSakId()
  const { data, error, isLoading } = useSwr<{ data: Hendelse[] }>(
    sakId ? `api/sak/${sakId}/historikk` : null,
    httpGet,
    {
      refreshInterval: 10_000,
    }
  )
  const hendelser = useSortering(data?.data || [], 'opprettet', sorterKronologiskSynkende)
  return {
    hendelser,
    error,
    isLoading,
  }
}
