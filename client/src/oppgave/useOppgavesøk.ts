import useSWR, { type SWRResponse } from 'swr'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type FinnOppgaverResponse } from './oppgaveTypes.ts'

export type UseOpppgavesøkResponse = SWRResponse<FinnOppgaverResponse, HttpError>

export function useOpppgavesøk({ fnr }: { fnr?: string }): UseOpppgavesøkResponse {
  return useSWR(
    () => (fnr ? ['/api/oppgaver-v2/sok', { fnr }] : null),
    (request) => {
      const [url, body] = request
      return http.post<{ fnr: string }, FinnOppgaverResponse>(url, body)
    }
  )
}
