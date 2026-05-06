import { type Actions, type ExecutionPromise, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import type { JournalførJournalpostRequest, JournalførJournalpostResponse } from './journalføringTypes.ts'

export interface JournalføringActions extends Actions {
  journalfør(request: Omit<JournalførJournalpostRequest, 'oppgaveId'>): ExecutionPromise<JournalførJournalpostResponse>
}

export function useJournalføringActions(oppgave: Oppgave): JournalføringActions {
  const { oppgaveId, versjon } = oppgave
  const { execute, state } = useActionState()
  if (!oppgaveId) {
    throw new Error('Mangler oppgaveId!')
  }
  return {
    journalfør(
      request: Omit<JournalførJournalpostRequest, 'oppgaveId'>
    ): ExecutionPromise<JournalførJournalpostResponse> {
      return execute(() =>
        http.post<JournalførJournalpostRequest, JournalførJournalpostResponse>(
          `/api/journalpost/${request.journalpostId}/journalforing`,
          { oppgaveId, ...request },
          { versjon }
        )
      )
    },

    state,
  }
}
