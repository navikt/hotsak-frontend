import useSWR from 'swr'
import { httpGet } from '../../io/http'
import { Artikkel } from '../../types/types.internal'

interface ArtiklerResponse {
  artikler: Artikkel[]
  isLoading: boolean
  isError: any
}

export function useArtiklerForSak(sakId: string): ArtiklerResponse {
  const { data, error } = useSWR<{ data: Artikkel[] }>(`api/sak/${sakId}/artikler`, httpGet)

  return {
    artikler: data?.data || [],
    isLoading: !error && !data,
    isError: error,
  }
}
