import useSWR, { SWRResponse } from 'swr'

import type { HttpError } from '../../io/HttpError.ts'
import type { Hjelpemiddel } from '../../types/types.internal'

interface HjelpemidlerJson {
  hjelpemidler: Hjelpemiddel[]
}

interface UseArtiklerForSakResponse extends Omit<SWRResponse<HjelpemidlerJson, HttpError>, 'data'> {
  artikler: Hjelpemiddel[]
}

export function useArtiklerForSak(sakId: string): UseArtiklerForSakResponse {
  const { data, ...rest } = useSWR<HjelpemidlerJson, HttpError>(`/api/sak/${sakId}/hjelpemidler`)
  return {
    artikler: data?.hjelpemidler ?? [],
    ...rest,
  }
}
