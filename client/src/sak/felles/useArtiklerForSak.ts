import useSWR, { SWRResponse } from 'swr'

import { type HttpError } from '../../io/HttpError.ts'
import { type ArtikkellinjeSak } from '../sakTypes.ts'

export interface UseHjelpemidlerForSakResponse extends Omit<SWRResponse<ArtikkellinjeSak[], HttpError>, 'data'> {
  artikler: ArtikkellinjeSak[]
}

/**
 * Hent alle artikler for `sakId`, både hjelpemidler, tilbehør og frittstående tilbehør.
 * Inkluderer evt. endringer gjort av saksbehandler.
 *
 * @param sakId
 */
export function useArtiklerForSak(sakId?: Nullable<ID>): UseHjelpemidlerForSakResponse {
  const { data, ...rest } = useSWR<ArtikkellinjeSak[], HttpError>(sakId ? `/api/sak/${sakId}/hjelpemidler` : null)
  return {
    artikler: data ?? ingenArtikler,
    ...rest,
  }
}

const ingenArtikler: ArtikkellinjeSak[] = []
