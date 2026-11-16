import useSWRMutation from 'swr/mutation'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { mutateOppgave } from '../oppgave/useOppgave.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import type { JournalføringRequest, JournalføringResponse, OverstyrInnsynsregler } from './journalføringTypes.ts'

type JournalføringArg = Omit<JournalføringRequest, 'oppgaveId' | 'journalpostId'>

type JournalføringRequestBody = Omit<JournalføringRequest, 'avsenderFnr' | 'dokumenter' | 'overstyrInnsynsregler'> & {
  avsenderFnr?: string
  dokumenter?: JournalføringRequest['dokumenter']
  overstyrInnsynsregler?: OverstyrInnsynsregler
}

export function byggJournalføringRequest(
  arg: JournalføringArg,
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

  const journalfør = useSWRMutation<JournalføringResponse, HttpError, string | null, JournalføringArg>(
    journalpostKey,
    (url, { arg }) =>
      http.post<JournalføringRequestBody, JournalføringResponse>(
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
