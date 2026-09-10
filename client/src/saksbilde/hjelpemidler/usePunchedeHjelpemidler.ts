import useSWR, { type SWRResponse } from 'swr'

import type { PunchetHjelpemiddel } from '../../journalføring/journalføringTypes.ts'
import type { HttpError } from '../../io/HttpError.ts'

export interface UsePunchedeHjelpemidlerResponse extends Omit<SWRResponse<PunchetHjelpemiddel[], HttpError>, 'data'> {
  punchedeHjelpemidler: PunchetHjelpemiddel[]
  harPunchedeHjelpemidler: boolean
}

export function usePunchedeHjelpemidler(sakId?: string): UsePunchedeHjelpemidlerResponse {
  const { data, ...rest } = useSWR<PunchetHjelpemiddel[], HttpError>(
    sakId ? `/api/sak/${sakId}/punchede-hjelpemidler` : null
  )

  const punchedeHjelpemidler = data ?? []

  return {
    punchedeHjelpemidler,
    harPunchedeHjelpemidler: punchedeHjelpemidler.length > 0,
    ...rest,
  }
}
