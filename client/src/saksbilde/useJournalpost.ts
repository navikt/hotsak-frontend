import useSwr, { KeyedMutator, mutate } from 'swr'

import type { HttpError } from '../io/HttpError.ts'
import { BREVKODE_BRILLER_TIL_BARN } from '../journalføring/journalføringStandardverdier.ts'
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

export function mutateJournalpost(journalpostId: string) {
  return mutate(`/api/journalpost/${journalpostId}`)
}

// # TODO: Bruk denne overalt og fas ut useJournalpost når V1 journalføring er borte
export function useJournalpostSuspense(journalpostId: string) {
  const { data: journalpost, mutate } = useSwr<Journalpost, HttpError>(`/api/journalpost/${journalpostId}`, {
    suspense: true,
  })
  const brevkode = journalpost?.dokumenter[0]?.brevkode
  const erBarnebrilleSøknad = brevkode !== undefined && BREVKODE_BRILLER_TIL_BARN.includes(brevkode)

  return { journalpost: journalpost as Journalpost, mutate, erBarnebrilleSøknad }
}
