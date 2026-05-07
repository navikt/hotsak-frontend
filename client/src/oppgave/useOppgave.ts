import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { type SWRResponse } from 'swr'

import { type HttpError } from '../io/HttpError.ts'
import { erOppgaveId, type Oppgave, type OppgaveId } from './oppgaveTypes.ts'

export function useOppgaveId(): OppgaveId | undefined {
  const { oppgaveId } = useParams<{ oppgaveId: OppgaveId | string }>()
  useDebugValue(oppgaveId)
  if (erOppgaveId(oppgaveId)) {
    return oppgaveId
  }
  return
}

export interface UseOppgaveResponse extends Omit<SWRResponse<Oppgave, HttpError>, 'data'> {
  oppgave: Oppgave
}

export function useOppgave(): UseOppgaveResponse {
  const oppgaveId = useOppgaveId()
  const { data: oppgave, ...rest } = useSwr<Oppgave>(oppgaveId ? `/api/oppgaver/${oppgaveId}` : null, {
    suspense: true,
  })
  return {
    // eslint-disable-next-line @typescript-eslint/no-extra-non-null-assertion
    oppgave: oppgave!!,
    ...rest,
  }
}
