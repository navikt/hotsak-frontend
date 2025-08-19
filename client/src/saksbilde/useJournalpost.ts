import useSwr, { KeyedMutator } from 'swr'

import type { HttpError } from '../io/HttpError.ts'
import type { Journalpost } from '../types/types.internal'

export interface JournalpostResponse {
  journalpost: Journalpost | undefined
  error?: HttpError
  mutate: KeyedMutator<Journalpost>
  isLoading: boolean
}

export function useJournalpost(journalpostId?: string): JournalpostResponse {
  const {
    data: journalpost,
    error,
    mutate,
    isLoading,
  } = useSwr<Journalpost, HttpError>(journalpostId ? `/api/journalpost/${journalpostId}` : null)

  return {
    journalpost,
    error,
    mutate,
    isLoading,
  }
}
