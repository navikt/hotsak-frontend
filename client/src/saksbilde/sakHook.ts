import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Sak } from '../types/types.internal'

export function useSak() {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr(`api/sak/${saksnummer}`, httpGet)

  return {
    sak: data?.data as Sak,
    isLoading: !error && !data,
    isError: error,
  }
}
