import useSwr, { type KeyedMutator } from 'swr'

import { createUrl } from '../../io/HttpClient.ts'
import type { HttpError } from '../../io/HttpError.ts'
import { type FinnOppgaverResponse, OppgaveTildeltFilter, Statuskategori } from '../../oppgave/oppgaveTypes.ts'

const pageNumber = 1
const pageSize = 500

export interface UseMineOppgaverResponse extends FinnOppgaverResponse {
  error?: HttpError
  mutate: KeyedMutator<FinnOppgaverResponse>
  isLoading: boolean
  isValidating: boolean
}

export function useMineOppgaver(): UseMineOppgaverResponse {
  const { data, error, mutate, isLoading, isValidating } = useSwr<FinnOppgaverResponse>(
    () =>
      createUrl('/api/oppgaver-v2', {
        tildelt: OppgaveTildeltFilter.MEG,
        statuskategori: Statuskategori.ÅPEN,
        page: pageNumber,
        limit: pageSize,
      }),
    {
      refreshInterval: 10_000,
    }
  )

  if (!data) {
    return {
      oppgaver: [],
      pageNumber,
      pageSize,
      totalPages: 0,
      totalElements: 0,
      error,
      mutate,
      isLoading,
      isValidating,
    }
  }

  return {
    ...data,
    error,
    mutate,
    isLoading,
    isValidating,
  }
}
