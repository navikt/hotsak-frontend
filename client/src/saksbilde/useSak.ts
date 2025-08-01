import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'
import { Sak, SakBase, SakResponse } from '../types/types.internal'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'

interface DataResponse<T extends SakBase> {
  sak?: SakResponse<T>
  isLoading: boolean
  isError: any
  mutate(...args: any[]): any
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
  const { data, error, isLoading, mutate } = useSwr<{ data: SakResponse<T> }>(
    sakId ? `api/sak/${sakId}` : null,
    httpGet,
    {
      refreshInterval: 10_000,
    }
  )

  return {
    sak: data?.data,
    isLoading: isLoading,
    isError: error,
    mutate,
  }
}
