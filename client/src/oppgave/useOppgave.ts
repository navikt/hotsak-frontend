import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { SWRResponse } from 'swr'

import { HttpError } from '../io/HttpError.ts'
import { useOppgaveContext } from './OppgaveContext.ts'
import { erOppgaveId, Oppgave, OppgaveId } from './oppgaveTypes.ts'

export function useOppgaveId(): OppgaveId | undefined {
  const { oppgaveId: oppgaveIdUrl } = useParams<{ oppgaveId: OppgaveId | string }>()
  const { oppgaveId: oppgaveIdOppgave } = useOppgaveContext()
  const oppgaveId = oppgaveIdUrl ?? oppgaveIdOppgave
  useDebugValue(oppgaveId)
  if (erOppgaveId(oppgaveId)) {
    return oppgaveId
  }
  return
}

export interface UseOppgaveResponse extends Omit<SWRResponse<Oppgave, HttpError>, 'data'> {
  oppgave?: Oppgave
}

export function useOppgave(): UseOppgaveResponse {
  const oppgaveId = useOppgaveId()
  const { data: oppgave, ...rest } = useSwr<Oppgave>(oppgaveId ? `/api/oppgaver/${oppgaveId}` : null)
  return {
    oppgave,
    ...rest,
  }
}
