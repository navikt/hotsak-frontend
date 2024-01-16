import useSwr from 'swr'

import { httpGet } from '../../io/http'

import { OppgaveV2 } from '../../types/types.internal'

const oppgaverBasePath = 'api/oppgaver-v2'
const ingenOppgaver: OppgaveV2[] = []

interface OppgaverResponse {
  oppgaver: OppgaveV2[]
  totalCount: number
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

export function useOppgaveliste(): OppgaverResponse {
  const { data, error, mutate } = useSwr<{ data: OppgaveV2[] }>(oppgaverBasePath, httpGet, {
    refreshInterval: 10_000,
  })

  const oppgaver = data?.data || ingenOppgaver
  return {
    oppgaver,
    totalCount: oppgaver.length,
    isLoading: !error && !data,
    error,
    mutate,
  }
}
