import type { SWRResponse } from 'swr'
import useSWRImmutable from 'swr/immutable'

import type { HttpError } from '../io/HttpError.ts'
import type { Behovsmelding, Innsenderbehovsmelding } from '../types/BehovsmeldingTypes'
import { useSakId } from './useSak.ts'

interface UseBehovsmeldingResponse<T extends Behovsmelding> extends Omit<SWRResponse<T, HttpError>, 'data'> {
  behovsmelding?: T
  harKunTilbehør: boolean
}

export function useBehovsmelding<T extends Behovsmelding = Innsenderbehovsmelding>(): UseBehovsmeldingResponse<T> {
  const sakId = useSakId()
  const { data: behovsmelding, ...rest } = useSWRImmutable<T, HttpError>(
    sakId ? `/api/sak/${sakId}/behovsmelding` : null
  )

  if (behovsmelding && behovsmelding.isDigitalBehovsmelding) {
    const hjelpemidler = behovsmelding?.hjelpemidler
    return {
      behovsmelding,
      harKunTilbehør: hjelpemidler?.hjelpemidler.length === 0 && hjelpemidler?.tilbehør.length > 0,
      ...rest,
    }
  }

  return {
    behovsmelding,
    harKunTilbehør: false,
    ...rest,
  }
}
