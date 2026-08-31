import useSWRMutation from 'swr/mutation'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { mutateOppgave } from '../oppgave/useOppgave.ts'
import type {
  JournalføringV2Request,
  JournalføringV2Response,
  JournalførJournalpostRequest,
} from './journalføringTypes.ts'

type JournalføringV1Arg = Omit<JournalførJournalpostRequest, 'oppgaveId' | 'journalpostId'>
type JournalføringV2Arg = Omit<JournalføringV2Request, 'oppgaveId' | 'journalpostId'>

export function useJournalføringActions(oppgave: Oppgave) {
  const { oppgaveId, versjon } = oppgave

  if (!oppgaveId) {
    throw new Error('Mangler oppgaveId!')
  }

  const journalpostId = oppgave.journalpostId
  const journalpostKey = journalpostId != null ? `/api/journalpost/${journalpostId}/journalforing` : null

  const journalfør = useSWRMutation<
    JournalføringV2Response,
    HttpError,
    string | null,
    JournalføringV1Arg | JournalføringV2Arg
  >(
    journalpostKey,
    (url, { arg }) =>
      http.post<JournalførJournalpostRequest | JournalføringV2Request, JournalføringV2Response>(
        url,
        {
          ...arg,
          oppgaveId,
          journalpostId: journalpostId!,
        },
        { versjon }
      ),
    {
      async onSuccess() {
        await mutateOppgave(oppgaveId)
      },
    }
  )

  return {
    journalfør,
  }
}
