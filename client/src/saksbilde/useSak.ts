import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import type { SakResponse } from '../types/types.internal'

interface DataResponse {
  sak: SakResponse | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

export function useSak(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error, isLoading, mutate } = useSwr<{ data: SakResponse }>(`api/sak/${saksnummer}`, httpGet, {
    refreshInterval: 10_000,
  })

  return {
    sak: data?.data,
    isLoading: isLoading,
    isError: error,
    mutate,
  }
}
