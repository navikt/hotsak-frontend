import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../../../io/http'
import { Hendelse } from '../../../types/types.internal'
import { useSortering } from '../../../utils/useSortering'
import { sorterKronologiskSynkende } from '../../../utils/dato'

interface DataResponse {
  hendelser: ReadonlyArray<Hendelse>
  error: any
  isLoading: boolean
}

export function useSakshistorikk(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error, isLoading } = useSwr<{ data: Hendelse[] }>(`api/sak/${saksnummer}/historikk`, httpGet, {
    refreshInterval: 10_000,
  })
  const hendelser = useSortering(data?.data || [], 'opprettet', sorterKronologiskSynkende)
  return {
    hendelser,
    error,
    isLoading,
  }
}
