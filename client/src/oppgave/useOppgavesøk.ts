import useSWR, { type SWRResponse } from 'swr'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type FinnOppgaverRequest, type FinnOppgaverResponse } from './oppgaveTypes.ts'

export type UseOppgavesøkResponse = SWRResponse<FinnOppgaverResponse, HttpError>

export function useOppgavesøk(request?: FinnOppgaverRequest, keepPreviousData?: boolean): UseOppgavesøkResponse {
  return useSWR(
    () => (request ? ['/api/oppgaver/sok', request] : null),
    (request) => {
      const [url, body] = request
      return http.post<FinnOppgaverRequest, FinnOppgaverResponse>(url, body)
    },
    { keepPreviousData: keepPreviousData ?? true }
  )
}
