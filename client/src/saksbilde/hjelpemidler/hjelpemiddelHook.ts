import useSwr from 'swr'

import { httpGet } from '../../io/http'

import { Hjelpemiddel } from '../../types/types.internal'

interface DataResponse {
  hjelpemiddel: Hjelpemiddel | undefined
  isLoading: boolean
  isError: any
}

export function useHjelpemiddel(hmsnummer?: string): DataResponse {
  const shouldFetch = hmsnummer !== undefined && hmsnummer !== ''

  const { data, error } = useSwr<{ data: Hjelpemiddel }>(shouldFetch ? `api/hjelpemiddel/${hmsnummer}` : null, httpGet)

  return {
    hjelpemiddel: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
