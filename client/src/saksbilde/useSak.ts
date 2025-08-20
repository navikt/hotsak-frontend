import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { KeyedMutator } from 'swr'

import { HttpError } from '../io/HttpError.ts'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'
import { Sak, SakBase, SakResponse } from '../types/types.internal'

interface DataResponse<T extends SakBase> {
  sak?: SakResponse<T>
  isError: any
  isLoading: boolean
  mutate: KeyedMutator<SakResponse<T>>
}

export function useSakId(): string | undefined {
  const { sakId: sakIdUrl } = useParams<{ sakId: string }>()
  const { sakId: sakIdOppgave } = useOppgaveContext()
  const sakId = sakIdUrl ?? sakIdOppgave
  useDebugValue(sakId)
  return sakId?.toString()
}

export function useSak<T extends SakBase = Sak>(): DataResponse<T> {
  const sakId = useSakId()
  const {
    data: sak,
    error,
    isLoading,
    mutate,
  } = useSwr<SakResponse<T>, HttpError>(sakId ? `/api/sak/${sakId}` : null, {
    refreshInterval: 10_000,
  })

  return {
    sak,
    isError: error, // fixme -> dette høres ut som en boolean, men er en HttpError, endre til bare `error`
    isLoading,
    mutate,
  }
}
