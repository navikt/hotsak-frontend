import { useDebugValue, useEffect } from 'react'
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
  const { saksnummer: sakIdUrl } = useParams<{ saksnummer: string }>()
  const { sakId: sakIdOppgave } = useOppgaveContext()
  const sakId = sakIdUrl ?? sakIdOppgave
  useDebugValue(sakId)
  return sakId?.toString()
}

export function useSak<T extends SakBase = Sak>(): DataResponse<T> {
  const sakId = useSakId()
  const { oppgaveId, setGjeldendeOppgave } = useOppgaveContext()
  const { data, error, isLoading, mutate } = useSwr<{ data: SakResponse<T> }>(
    sakId ? `api/sak/${sakId}` : null,
    httpGet,
    {
      refreshInterval: 10_000,
    }
  )

  useEffect(() => {
    // Vi har en sakId, men ikke oppgaveId fra OppgaveContext, vi er ikke i kontekst av en Oppgave
    if (sakId && !oppgaveId) {
      setGjeldendeOppgave({ oppgaveId: `S-${sakId}`, versjon: -1, sakId })
    }
  }, [sakId, oppgaveId])

  return {
    sak: data?.data,
    isLoading: isLoading,
    isError: error,
    mutate,
  }
}
