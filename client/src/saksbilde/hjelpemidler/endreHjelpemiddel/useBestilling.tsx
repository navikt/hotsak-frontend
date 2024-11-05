import { useParams } from 'react-router'
import useSwr from 'swr'
import { httpGet } from '../../../io/http'
import { Bestilling } from '../../../types/types.internal'

interface BestillingResponse {
  bestilling: Bestilling | undefined
}

export function useBestilling(): BestillingResponse {
  const { saksnummer: sakId } = useParams<{ saksnummer: string }>()
  const { data } = useSwr<{ data: Bestilling }>([`api/bestilling/${sakId}`], httpGet)

  return {
    bestilling: data?.data || undefined,
  }
}
