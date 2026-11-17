import useSwr from 'swr'

import type { HttpError } from '../io/HttpError.ts'
import { BREVKODE_BRILLER_TIL_BARN } from '../journalføring/journalføringStandardverdier.ts'
import type { Journalpost } from '../types/types.internal'

export function useJournalpostSuspense(journalpostId: string) {
  const { data: journalpost, mutate } = useSwr<Journalpost, HttpError>(`/api/journalpost/${journalpostId}`, {
    suspense: true,
  })
  const brevkode = journalpost?.dokumenter[0]?.brevkode
  const erBarnebrilleSøknad = brevkode !== undefined && BREVKODE_BRILLER_TIL_BARN.includes(brevkode)

  return { journalpost: journalpost as Journalpost, mutate, erBarnebrilleSøknad }
}
