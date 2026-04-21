import type { SWRResponse } from 'swr'
import useSWRImmutable from 'swr/immutable'

import type { HttpError } from '../io/HttpError.ts'
import type { Innsenderbehovsmelding } from '../types/BehovsmeldingTypes'
import { useSakId } from './useSak.ts'

interface UseBehovsmeldingResponse extends Omit<SWRResponse<Innsenderbehovsmelding, HttpError>, 'data'> {
  behovsmelding?: Innsenderbehovsmelding
  harKunTilbehør: boolean
}

export function useBehovsmelding(): UseBehovsmeldingResponse {
  const sakId = useSakId()
  const { data: behovsmelding, ...rest } = useSWRImmutable<Innsenderbehovsmelding, HttpError>(
    sakId ? `/api/sak/${sakId}/behovsmelding` : null
  )

  return {
    behovsmelding,
    harKunTilbehør:
      behovsmelding?.hjelpemidler?.hjelpemidler.length === 0 && behovsmelding?.hjelpemidler?.tilbehør.length > 0,
    ...rest,
  }
}
