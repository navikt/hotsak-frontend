import useSWR from 'swr'
import { httpGet } from '../../io/http'
import { Hjelpemiddel } from '../../types/types.internal'

interface ArtiklerResponse {
  artikler: Hjelpemiddel[]
  isLoading: boolean
  isError: any
  mutate: () => void
}

interface HjelpemidlerJson {
  hjelpemidler: Hjelpemiddel[]
}

export function useArtiklerForSak(sakId: string): ArtiklerResponse {
  const { data, error, mutate } = useSWR<{ data: HjelpemidlerJson }>(`api/sak/${sakId}/hjelpemidler`, httpGet)

  return {
    artikler: data?.data.hjelpemidler || [],
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
