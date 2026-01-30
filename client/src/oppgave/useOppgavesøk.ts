import useSWR, { type SWRResponse } from 'swr'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type FinnOppgaverRequest, type FinnOppgaverResponse } from './oppgaveTypes.ts'

export type UseOpppgavesøkResponse = SWRResponse<FinnOppgaverResponse, HttpError>

export function useOpppgavesøk({ fnr }: { fnr?: string }): UseOpppgavesøkResponse {
  return useSWR(
    () => (request ? ['/api/oppgaver-v2/sok', request] : null),
    (request) => {
      const [url, body] = request
      return http.post<FinnOppgaverRequest, FinnOppgaverResponse>(url, body)
    }
  )
}
