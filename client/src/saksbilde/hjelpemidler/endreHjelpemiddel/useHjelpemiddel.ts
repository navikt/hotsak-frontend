import useSwr from 'swr'

import { httpGet } from '../../../io/http'

import { HjelpemiddelProdukt } from '../../../types/types.internal'

interface DataResponse {
  hjelpemiddel: HjelpemiddelProdukt | undefined
  isLoading: boolean
  isError: any
}

export function useHjelpemiddel(hmsnummer?: string): DataResponse {
  const shouldFetch = hmsnummer && hmsnummer !== undefined && hmsnummer !== ''
  // TODO kalle FH for å hente hjelpemiddel her og eventuelt fallback til OeBS hvis ikke funnet i FH
  const { data, error } = useSwr<{ data: HjelpemiddelProdukt }>(
    shouldFetch ? `api/hjelpemiddel/${hmsnummer}` : null,
    httpGet
  )

  return {
    hjelpemiddel: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
