import useSwr from 'swr'

import { Hendelse } from '../../../types/types.internal'
import { sorterKronologiskSynkende } from '../../../utils/dato'
import { useSortering } from '../../../utils/useSortering'
import { useSakId } from '../../useSak.ts'

interface DataResponse {
  hendelser: ReadonlyArray<Hendelse>
  error: any
  isLoading: boolean
}

export function useSakshistorikk(): DataResponse {
  const sakId = useSakId()
  const { data, error, isLoading } = useSwr<Hendelse[]>(sakId ? `/api/sak/${sakId}/historikk` : null, {
    refreshInterval: 10_000,
  })
  const hendelser = useSortering(data ?? [], 'opprettet', sorterKronologiskSynkende)
  return {
    hendelser,
    error,
    isLoading,
  }
}
