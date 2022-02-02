import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Sak } from '../types/types.internal'

interface DataResponse {
  sak: Sak | undefined
  isLoading: boolean
  isError: any
}

export function useSak(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr<{ data: Sak }>(`api/sak/${saksnummer}`, httpGet, {refreshInterval: 10000})

  return {
    sak: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
