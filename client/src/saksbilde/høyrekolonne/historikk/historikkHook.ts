import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../../../io/http'

import { Hendelse } from '../../../types/types.internal'

interface DataResponse {
  hendelser: Hendelse[] | undefined
  isLoading: boolean
  isError: any
}

export function useHistorikk(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr<{ data: Hendelse[] }>(`api/sak/${saksnummer}/historikk`, httpGet, {refreshInterval: 10000})

  return {
    hendelser: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
