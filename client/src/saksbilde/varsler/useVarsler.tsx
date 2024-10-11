import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../../io/http'

import type { Varsel } from '../../types/types.internal'

interface VarslerDataResponse {
  varsler: Varsel[]
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

export function useVarsler(): VarslerDataResponse {
  const { saksnummer: sakId } = useParams<{ saksnummer: string }>()
  const { data, error, isLoading, mutate } = useSwr<{ data: Varsel[] }>(
    window.appSettings.MILJO !== 'prod-gcp' ? [`api/sak/${sakId}/varsler`] : null,
    httpGet
  )

  return {
    varsler: data?.data || [],
    isLoading: isLoading,
    isError: error,
    mutate,
  }
}
