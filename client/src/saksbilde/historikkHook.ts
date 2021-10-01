import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Hendelse } from '../types/types.internal'

export function useHistorikk() {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr(`api/sak/${saksnummer}/historikk`, httpGet)

  return {
    hendelser: data?.data as Hendelse[],
    isLoading: !error && !data,
    isError: error,
  }
}
