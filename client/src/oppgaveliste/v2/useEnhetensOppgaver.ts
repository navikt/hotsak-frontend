import useSWRInfinite, { type SWRInfiniteKeyedMutator } from 'swr/infinite'

import { createUrl } from '../../io/HttpClient.ts'
import type { HttpError } from '../../io/HttpError.ts'
import { FinnOppgaverResponse, OppgaveTildeltFilter, Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'

export interface UseEnhetensOppgaverResponse extends FinnOppgaverResponse {
  error?: HttpError
  mutate: SWRInfiniteKeyedMutator<FinnOppgaverResponse[]>
  isLoading: boolean
  lastInnFlere(): Promise<FinnOppgaverResponse[] | undefined>
}

export function useEnhetensOppgaver(pageSize: number): UseEnhetensOppgaverResponse {
  const { sort, oppgavetypeFilter, gjelderFilter } = useOppgaveFilterContext()
  const { data, error, mutate, isLoading, size, setSize } = useSWRInfinite<FinnOppgaverResponse>(
    (index, previousPageData) => {
      if (previousPageData && !previousPageData.oppgaver.length) return null
      const page = index + 1
      let sorteringsfelt: string | undefined
      switch (sort.orderBy) {
        case 'fristFerdigstillelse':
          sorteringsfelt = 'FRIST'
          break
        case 'opprettetTidspunkt':
          sorteringsfelt = 'OPPRETTET_TIDSPUNKT'
          break
      }
      let sorteringsrekkefølge: string | undefined
      switch (sort.direction) {
        case 'ascending':
          sorteringsfelt = 'ASC'
          break
        case 'descending':
          sorteringsrekkefølge = 'DESC'
          break
      }
      return createUrl('/api/oppgaver-v2', {
        tildelt: OppgaveTildeltFilter.INGEN,
        statuskategori: Statuskategori.ÅPEN,
        oppgavetype: oppgavetypeFilter,
        gjelder: gjelderFilter,
        sorteringsfelt,
        sorteringsrekkefølge,
        page,
        limit: pageSize,
      })
    },
    {
      refreshInterval: 10_000,
    }
  )

  const lastInnFlere = () => setSize(size + 1)

  if (!data) {
    return {
      ...noResult,
      pageSize,
      error,
      mutate,
      isLoading,
      lastInnFlere,
    }
  }

  const { pageNumber, totalPages, totalElements } = data[0] ?? noResult
  return {
    oppgaver: data.flatMap((it) => it.oppgaver),
    pageNumber,
    pageSize,
    totalPages,
    totalElements,
    error,
    mutate,
    isLoading,
    lastInnFlere,
  }
}

const noResult = { oppgaver: [], pageNumber: 1, totalPages: 0, totalElements: 0 }
