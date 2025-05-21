import useSwr from 'swr'

import { httpGet } from '../../../io/http'
import { Bestilling, Sakstype } from '../../../types/types.internal'
import { useSak } from '../../useSak'

interface BestillingResponse {
  bestilling: Bestilling | undefined
  mutate: () => void
}

export function useBestilling(): BestillingResponse {
  const { sak } = useSak()

  const url = sak && sak.data.sakstype === Sakstype.BESTILLING ? `api/bestilling/${sak.data.sakId}` : null
  const { data, mutate } = useSwr<{ data: Bestilling }>([url], httpGet, {
    shouldRetryOnError: false,
  })

  return {
    bestilling: data?.data || undefined,
    mutate: mutate,
  }
}
