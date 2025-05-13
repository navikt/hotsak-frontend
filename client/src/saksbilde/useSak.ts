import { useParams } from 'react-router'
import useSwr from 'swr'
import { useEffect } from 'react'

import { httpGet } from '../io/http'
import type { Sak, SakBase, SakResponse } from '../types/types.internal'
import { lagGjeldendeOppgave, useOppgaveContext } from '../oppgave/OppgaveContext.ts'

interface DataResponse<T extends SakBase> {
  sak?: SakResponse<T>
  isLoading: boolean
  isError: any
  mutate(...args: any[]): any
}

export function useSak<T extends SakBase = Sak>(): DataResponse<T> {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error, isLoading, mutate } = useSwr<{ data: SakResponse<T> }>(`api/sak/${saksnummer}`, httpGet, {
    refreshInterval: 10_000,
  })

  const { setGjeldendeOppgave } = useOppgaveContext()
  useEffect(() => {
    if (data && data.data) {
      const { data: sak, oppgave } = data.data
      const sakId = sak.sakId
      setGjeldendeOppgave(lagGjeldendeOppgave(oppgave?.oppgaveId, oppgave?.versjon, sakId))
    }
  }, [data, setGjeldendeOppgave])

  return {
    sak: data?.data,
    isLoading: isLoading,
    isError: error,
    mutate,
  }
}
