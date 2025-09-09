import useSwr, { SWRResponse } from 'swr'

import type { HttpError } from '../io/HttpError.ts'
import type { Innsenderbehovsmelding } from '../types/BehovsmeldingTypes'
import { useSakId } from './useSak.ts'

interface UseBehovsmeldingResponse extends Omit<SWRResponse<Innsenderbehovsmelding, HttpError>, 'data'> {
  behovsmelding?: Innsenderbehovsmelding
}

export function useBehovsmelding(): UseBehovsmeldingResponse {
  const sakId = useSakId()
  const { data: behovsmelding, ...rest } = useSwr<Innsenderbehovsmelding, HttpError>(
    sakId ? `/api/sak/${sakId}/behovsmelding` : null
  )
  return {
    behovsmelding,
    ...rest,
  }
}
