import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { SWRResponse } from 'swr'

import { HttpError } from '../io/HttpError.ts'
import { useOppgaveContext } from './OppgaveContext.ts'
import { OppgaveId, OppgaveV2 } from './oppgaveTypes.ts'

export function useOppgaveId(): OppgaveId | undefined {
  const { oppgaveId: oppgaveIdUrl } = useParams<{ oppgaveId: OppgaveId }>()
  const { oppgaveId: oppgaveIdOppgave } = useOppgaveContext()
  const oppgaveId = oppgaveIdUrl ?? oppgaveIdOppgave
  useDebugValue(oppgaveId)
  return oppgaveId
}

export interface UseOppgaveResponse extends Omit<SWRResponse<OppgaveV2, HttpError>, 'data'> {
  oppgave?: OppgaveV2
}

export function useOppgave(): UseOppgaveResponse {
  const oppgaveId = useOppgaveId()
  const { data: oppgave, ...rest } = useSwr<OppgaveV2>(oppgaveId ? `/api/oppgaver-v2/${oppgaveId}` : null)
  return {
    oppgave,
    ...rest,
  }
}
