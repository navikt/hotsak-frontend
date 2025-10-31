import useSWRInfinite from 'swr/infinite'

import { createQueryString } from '../../io/HttpClient.ts'
import type { FinnOppgaverResponse } from '../../oppgave/oppgaveTypes.ts'

export function useEnhetensOppgaver(pageSize: number) {
  // const { sort, oppgavetypeFilter, gjelderFilter } = useOppgaveFilterContext()
  const { data, error, mutate, isLoading, size, setSize } = useSWRInfinite<FinnOppgaverResponse>(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.oppgaver.length) return null
      const page = index + 1
      const parameters = createQueryString({ page, limit: pageSize })
      return `/api/oppgaver-v2?${parameters}`
    },
    {
      refreshInterval: 10_000,
    }
  )

  console.log('size: ', size)

  const lastInnFlere = () => setSize(size + 1)

  if (!data) {
    return {
      oppgaver: [],
      isLoading,
      error,
      mutate,
      lastInnFlere,
      totalElements: 0,
    }
  }

  return {
    oppgaver: data.flatMap((it) => it.oppgaver),
    isLoading,
    error,
    mutate,
    lastInnFlere,
    totalElements: data[0]?.totalElements ?? 0,
  }
}
