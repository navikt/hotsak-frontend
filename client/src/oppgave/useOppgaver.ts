import useSwr, { type SWRResponse } from 'swr'

import { createUrl, type QueryParameters } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import {
  type FinnOppgaverResponse,
  type OppgaveTildelt,
  type Oppgavetype,
  type Statuskategori,
} from './oppgaveTypes.ts'

export interface UseOppgaverRequest extends QueryParameters {
  statuskategori?: Statuskategori
  oppgavetype?: Oppgavetype[]
  tildelt?: OppgaveTildelt
  sorteringsfelt?: 'FRIST' | 'OPPRETTET_TIDSPUNKT'
  sorteringsrekkefølge?: 'ASC' | 'DESC'
  page?: number
  limit?: number
}

export type UseOppgaverResponse = SWRResponse<FinnOppgaverResponse, HttpError>

export function useOppgaver(request: UseOppgaverRequest): UseOppgaverResponse {
  return useSwr<FinnOppgaverResponse>(() => createUrl('/api/oppgaver-v2', request), {
    refreshInterval: 10_000,
  })
}
