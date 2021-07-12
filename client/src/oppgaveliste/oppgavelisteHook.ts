import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Oppgave } from '../types/types.internal'

export function useOppgaveliste() {
  const { data, error } = useSwr('http://localhost:3001/api/oppgaver', httpGet)

  return {
    oppgaver: data?.data as Oppgave[],
    isLoading: !error && !data,
    isError: error,
  }
}
