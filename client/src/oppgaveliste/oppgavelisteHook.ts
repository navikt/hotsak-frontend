import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Oppgave } from '../types/types.internal'

export function useOppgaveliste() {
    console.log('kaller oppgaveliste api/oppgaver')
  const { data, error } = useSwr('api/oppgaver', httpGet)

  return {
    oppgaver: data?.data as Oppgave[],
    isLoading: !error && !data,
    isError: error,
  }
}
