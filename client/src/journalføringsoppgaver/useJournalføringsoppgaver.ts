import useSwr, { SWRResponse } from 'swr'

import { createUrl } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import {
  type FinnOppgaverResponse,
  type OppgaveTildeltFilter,
  Oppgavetype,
  Statuskategori,
} from '../oppgave/oppgaveTypes.ts'

export type UseJournalføringsoppgaverResponse = SWRResponse<FinnOppgaverResponse, HttpError>

const pageNumber = 1
const pageSize = 500

export function useJournalføringsoppgaver(tildelt?: OppgaveTildeltFilter): UseJournalføringsoppgaverResponse {
  return useSwr<FinnOppgaverResponse>(
    () =>
      createUrl('/api/oppgaver-v2', {
        tildelt,
        statuskategori: Statuskategori.ÅPEN,
        oppgavetype: Oppgavetype.JOURNALFØRING,
        page: pageNumber,
        limit: pageSize,
      }),
    {
      refreshInterval: 10_000,
    }
  )
}
