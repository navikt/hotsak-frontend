import useSWR, { SWRResponse } from 'swr'

import type { HttpError } from '../../io/HttpError.ts'
import { HjelpemiddelEndring } from './endreHjelpemiddel/endreProduktTypes.ts'

interface HjelpemidlerJson {
  hjelpemidler: HjelpemiddelEndring[]
}

interface UseArtiklerForSakResponse extends Omit<SWRResponse<HjelpemidlerJson, HttpError>, 'data'> {
  artikler: HjelpemiddelEndring[]
}

export function useArtiklerForSak(sakId: string): UseArtiklerForSakResponse {
  const { data, ...rest } = useSWR<HjelpemidlerJson, HttpError>(`/api/sak/${sakId}/hjelpemidler`)
  return {
    artikler: data?.hjelpemidler ?? [],
    ...rest,
  }
}
