import { useParams } from 'react-router'
import useSwr from 'swr'
import { httpGet } from '../../../io/http'
import { Bestilling, Sakstype } from '../../../types/types.internal'
import { useSak } from '../../useSak'

interface BestillingResponse {
  bestilling: Bestilling | undefined
  mutate: () => void
}

export function useBestilling(): BestillingResponse {
  const { saksnummer: sakId } = useParams<{ saksnummer: string }>()
  const { sak } = useSak()

  const url = sak?.data.sakstype === Sakstype.BESTILLING ? `api/bestilling/${sakId}` : null
  const { data, mutate } = useSwr<{ data: Bestilling }>([url], httpGet, {
    shouldRetryOnError: false,
  })

  return {
    bestilling: data?.data || undefined,
    mutate: mutate,
  }
}
