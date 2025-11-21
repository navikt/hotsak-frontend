import useSWR, { SWRResponse } from 'swr'

import type { HttpError } from '../../io/HttpError.ts'
import { HjelpemiddelEndring } from './endreHjelpemiddel/endreProduktTypes.ts'

interface UseArtiklerForSakResponse extends Omit<SWRResponse<HjelpemiddelEndring[], HttpError>, 'data'> {
  artikler: HjelpemiddelEndring[]
}

export function useArtiklerForSak(sakId: string): UseArtiklerForSakResponse {
  const { data, ...rest } = useSWR<HjelpemiddelEndring[], HttpError>(`/api/sak/${sakId}/hjelpemidler`)
  return {
    artikler: data ?? [],
    ...rest,
  }
}
