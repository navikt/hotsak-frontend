import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { SWRResponse } from 'swr'

import { HttpError } from '../io/HttpError.ts'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'
import { Sak, SakBase, SakResponse } from '../types/types.internal'

export function useSakId(): string | undefined {
  const { sakId: sakIdUrl } = useParams<{ sakId: string }>()
  const { sakId: sakIdOppgave } = useOppgaveContext()
  const sakId = sakIdUrl ?? sakIdOppgave
  useDebugValue(sakId)
  return sakId?.toString()
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
