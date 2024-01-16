import useSwr from 'swr'

import { httpGet } from '../../io/http'

import { OppgaverResponse } from '../../types/types.internal'

const oppgaverBasePath = 'api/oppgaver-v2'
//const ingenOppgaver: OppgaveV2[] = []

interface OppgaverData {
  data?: OppgaverResponse
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

export function useOppgaveliste(): OppgaverData {
  const { data, error, mutate, isLoading } = useSwr<{ data: OppgaverResponse }>(oppgaverBasePath, httpGet, {
    refreshInterval: 10_000,
  })

  //const oppgaver = data || ingenOppgaver
  return {
    ...data,
    isLoading,
    error,
    mutate,
  }
}
