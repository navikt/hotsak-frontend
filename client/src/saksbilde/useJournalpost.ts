import useSwr from 'swr'

import { httpGet } from '../io/http'

import type { Journalpost } from '../types/types.internal'

interface JournalpostResponse {
  journalpost: Journalpost | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

export function useJournalpost(journalpostID?: string): JournalpostResponse {
  const { data, error, mutate } = useSwr<{ data: Journalpost }>(`api/journalpost/${journalpostID}`, httpGet)

  return {
    journalpost: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
