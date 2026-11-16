import useSWRMutation from 'swr/mutation'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { mutateOppgave } from '../oppgave/useOppgave.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import type {
  JournalføringV2Request,
  JournalføringV2Response,
  JournalførJournalpostRequest,
  OverstyrInnsynsregler,
} from './journalføringTypes.ts'

type JournalføringV1Arg = Omit<JournalførJournalpostRequest, 'oppgaveId' | 'journalpostId'>
type JournalføringV2Arg = Omit<JournalføringV2Request, 'oppgaveId' | 'journalpostId'>

type JournalføringRequestBody = Omit<JournalføringV2Request, 'avsenderFnr' | 'dokumenter' | 'overstyrInnsynsregler'> & {
  avsenderFnr?: string
  dokumenter?: JournalføringV2Request['dokumenter']
  overstyrInnsynsregler?: OverstyrInnsynsregler
}

export function byggJournalføringRequest(
  arg: JournalføringV1Arg | JournalføringV2Arg,
  oppgaveId: string,
  journalpostId: string,
  erProd: boolean
): JournalføringRequestBody {
  const { overstyrInnsynsregler, ...request } = arg

  return {
    ...request,
    ...(erProd ? {} : { overstyrInnsynsregler }),
    oppgaveId,
    journalpostId,
  }
}

export function useJournalføringActions(oppgave: Oppgave) {
  const { oppgaveId, versjon } = oppgave
  const { erProd } = useMiljø()

  if (!oppgaveId) {
    throw new Error('Mangler oppgaveId!')
  }

  const journalpostId = oppgave.journalpostId
  const journalpostKey = journalpostId ? `/api/journalpost/${journalpostId}/journalforing` : null

  const journalfør = useSWRMutation<
    JournalføringV2Response,
    HttpError,
    string | null,
    JournalføringV1Arg | JournalføringV2Arg
  >(
    journalpostKey,
    (url, { arg }) =>
      http.post<JournalføringRequestBody, JournalføringV2Response>(
        url,
        byggJournalføringRequest(arg, oppgaveId, journalpostId!, erProd),
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

export type UseJournalføringActionsResponse = ReturnType<typeof useJournalføringActions>
