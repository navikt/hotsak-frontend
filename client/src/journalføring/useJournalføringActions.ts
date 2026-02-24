import { Actions, ExecutionPromise, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'
import type { JournalførJournalpostRequest, JournalførJournalpostResponse } from './journalføringTypes.ts'

export interface JournalføringActions extends Actions {
  journalfør(request: Omit<JournalførJournalpostRequest, 'oppgaveId'>): ExecutionPromise<JournalførJournalpostResponse>
}

export function useJournalføringActions(): JournalføringActions {
  const { execute, state } = useActionState()
  const { oppgaveId, versjon } = useOppgaveContext()
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
