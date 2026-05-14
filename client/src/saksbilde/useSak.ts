import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { type SWRResponse } from 'swr'

import type { HttpError } from '../io/HttpError.ts'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'
import type { OppgaveBase } from '../oppgave/oppgaveTypes.ts'
import type { Sak, SakBase, SakResponse } from '../types/types.internal'

export function useSakId(oppgave?: OppgaveBase): string {
  const { sakId: sakIdUrl } = useParams<{ sakId: string }>()
  const { sakId: sakIdContext } = useOppgaveContext()
  const sakId = sakIdUrl ?? oppgave?.sakId ?? sakIdContext ?? ''
  useDebugValue(sakId)
  return sakId.toString()
}

export interface UseSakResponse<T extends SakBase> extends Omit<SWRResponse<SakResponse<T>, HttpError>, 'data'> {
  sak?: SakResponse<T>
}

export function useSak<T extends SakBase = Sak>(): UseSakResponse<T> {
  const sakId = useSakId()
  const { data: sak, ...rest } = useSwr<SakResponse<T>, HttpError>(sakId ? `/api/sak/${sakId}` : null, {
    refreshInterval: 10_000,
  })

  return {
    sak,
    ...rest,
  }
}
