import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Oppgave } from '../types/types.internal'

interface DataResponse {
  oppgaver: Oppgave[] | undefined
  isLoading: boolean
  isError: any
}

export function useOppgaveliste(): DataResponse {
  const { data, error } = useSwr<{ data: Oppgave[] }>('api/oppgaver', httpGet)

  return {
    oppgaver: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
