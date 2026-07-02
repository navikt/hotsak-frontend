import useSWRMutation from 'swr/mutation'

import { type Actions, type ExecutionPromise, useActionState } from '../action/Actions.ts'
import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { type HttpError } from '../io/HttpError.ts'
import { http } from '../io/HttpClient.ts'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { mutateOppgave } from '../oppgave/useOppgave.ts'
import type {
  JournalførJournalpostRequest,
  JournalførJournalpostResponse,
  JournalføringV2Request,
  JournalføringV2Response,
} from './journalføringTypes.ts'

export interface JournalføringActions extends Actions {
  journalfør(request: Omit<JournalførJournalpostRequest, 'oppgaveId'>): ExecutionPromise<JournalførJournalpostResponse>
}

export function useJournalføringActions(oppgave: Oppgave, journalpostId?: string) {
  const { oppgaveId, versjon } = oppgave
  const { execute, state } = useActionState()
  const { showSuccessToast } = useToast()
  if (!oppgaveId) {
    throw new Error('Mangler oppgaveId!')
  }

  type JournalføringV2Arg = Omit<JournalføringV2Request, 'oppgaveId' | 'journalpostId'>
  const journalpostKey = journalpostId != null ? `/api/journalpost/${journalpostId}/journalforing` : null
  const journalførV2 = useSWRMutation<JournalføringV2Response, HttpError, string | null, JournalføringV2Arg>(
    journalpostKey,
    (url, { arg }) =>
      http.post<JournalføringV2Request, JournalføringV2Response>(url, {
        ...arg,
        oppgaveId,
        journalpostId: journalpostId!,
      }),
    {
      async onSuccess() {
        showSuccessToast('Journalpost ferdig journalført')
        await mutateOppgave(oppgaveId)
      },
    }
  )

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

    journalførV2,
    state,
  }
}
