import { Actions, ExecutionPromise, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import { OppgaveId } from '../oppgave/oppgaveTypes.ts'
import type { JournalføringRequest } from '../types/types.internal.ts'

export interface JournalføringResponse {
  sakId: string
  /**
   * Id for behandle sak-oppgaven som følger journalføring.
   */
  oppgaveId?: OppgaveId
}

export interface JournalføringActions extends Actions {
  journalfør(request: JournalføringRequest): ExecutionPromise<JournalføringResponse>
}

export function useJournalføringActions(): JournalføringActions {
  const { execute, state } = useActionState()

  return {
    journalfør(request: JournalføringRequest): ExecutionPromise<JournalføringResponse> {
      return execute(() =>
        http.post<JournalføringRequest, JournalføringResponse>(
          `/api/journalpost/${request.journalpostId}/journalforing`,
          request
        )
      )
    },

    state,
  }
}
