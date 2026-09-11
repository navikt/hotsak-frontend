import useSWR, { type SWRResponse } from 'swr'
import { useSWRConfig } from 'swr'

import type {
  LagretPunchetHjelpemiddel,
  PunchedeHjelpemidlerResponse,
  PunchetHjelpemiddel,
} from '../../journalføring/journalføringTypes.ts'
import type { HttpError } from '../../io/HttpError.ts'
import { http } from '../../io/HttpClient.ts'

export interface UsePunchedeHjelpemidlerResponse extends Omit<
  SWRResponse<PunchedeHjelpemidlerResponse, HttpError>,
  'data'
> {
  punchedeHjelpemidler: LagretPunchetHjelpemiddel[]
  erPunchetPapirsøknad: boolean
  harPunchedeHjelpemidler: boolean
  lagreHjelpemiddel(hjelpemiddel: PunchetHjelpemiddel | LagretPunchetHjelpemiddel): Promise<void>
  slettHjelpemiddel(hjelpemiddelId: string): Promise<void>
}

export function usePunchedeHjelpemidler(sakId?: string): UsePunchedeHjelpemidlerResponse {
  const nøkkel = sakId ? `/api/sak/${sakId}/punchede-hjelpemidler` : null
  const { data, mutate, ...rest } = useSWR<PunchedeHjelpemidlerResponse, HttpError>(nøkkel)
  const { mutate: globalMutate } = useSWRConfig()

  const punchedeHjelpemidler = data?.hjelpemidler ?? []

  return {
    punchedeHjelpemidler,
    erPunchetPapirsøknad: data?.erPunchetPapirsøknad ?? false,
    harPunchedeHjelpemidler: punchedeHjelpemidler.length > 0,
    mutate,
    async lagreHjelpemiddel(hjelpemiddel) {
      if (!sakId) {
        throw new Error('Kan ikke lagre hjelpemiddel uten sakId')
      }
      await http.put(`/api/sak/${sakId}/punchede-hjelpemidler`, hjelpemiddel)
      await mutate()
    },
    async slettHjelpemiddel(hjelpemiddelId) {
      if (!sakId) {
        throw new Error('Kan ikke slette hjelpemiddel uten sakId')
      }
      await http.delete(`/api/sak/${sakId}/punchede-hjelpemidler/${hjelpemiddelId}`)
      await mutate()
      await globalMutate(`/api/sak/${sakId}/hjelpemidler`)
    },
    ...rest,
  }
}
