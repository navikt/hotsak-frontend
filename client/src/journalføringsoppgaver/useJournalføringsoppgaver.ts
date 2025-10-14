import useSwr, { SWRResponse } from 'swr'

import { createQueryString } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import {
  type FinnOppgaverResponse,
  type OppgaveTildeltFilter,
  Oppgavetype,
  Statuskategori,
} from '../oppgave/oppgaveTypes.ts'

export type UseJournalføringsoppgaverResponse = SWRResponse<FinnOppgaverResponse, HttpError>

export function useJournalføringsoppgaver(tildelt?: OppgaveTildeltFilter): UseJournalføringsoppgaverResponse {
  const query = createQueryString({
    oppgavetype: Oppgavetype.JOURNALFØRING,
    statuskategori: Statuskategori.ÅPEN,
    tildelt,
  })
  return useSwr<FinnOppgaverResponse>(`/api/oppgaver-v2?${query}`, {
    refreshInterval: 10_000,
  })
}
