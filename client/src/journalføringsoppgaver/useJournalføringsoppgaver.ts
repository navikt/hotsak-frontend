import useSwr, { SWRResponse } from 'swr'

import { HttpError } from '../io/HttpError.ts'
import { FinnOppgaverResponse, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'

export type UseJournalføringsoppgaverResponse = SWRResponse<FinnOppgaverResponse, HttpError>

export function useJournalføringsoppgaver(): UseJournalføringsoppgaverResponse {
  return useSwr<FinnOppgaverResponse>(
    `/api/oppgaver-v2?oppgavetype=${encodeURIComponent(Oppgavetype.JOURNALFØRING)}&statuskategori=${encodeURIComponent(Statuskategori.ÅPEN)}`,
    {
      refreshInterval: 10_000,
    }
  )
}
