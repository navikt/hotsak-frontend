import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../../io/http'

import { Sak } from '../../types/types.internal'

interface DataResponse {
  bestilling: Sak | undefined
  isLoading: boolean
  isError: any
}

export function useBestilling(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr<{ data: Sak }>(`api/bestilling/${saksnummer}`, httpGet, {
    refreshInterval: 10000,
  })

  return {
    bestilling: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
