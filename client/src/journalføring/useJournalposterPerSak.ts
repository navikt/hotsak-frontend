import { subYears, format } from 'date-fns'
import { useMemo } from 'react'

import { useDokumentsøk } from '../dokument/useDokumentsøk.ts'
import type { Journalpost } from '../types/types.internal.ts'

export interface UseJournalposterPerSakResponse {
  journalposterPerSak: Map<string, Journalpost[]>
  isLoading: boolean
  error?: unknown
}

export function useJournalposterPerSak(fnr?: string): UseJournalposterPerSakResponse {
  const fraDato = format(subYears(new Date(), 1), 'yyyy-MM-dd')
  const { journalposter, isLoading, error } = useDokumentsøk({ fnr, fraDato })

  const journalposterPerSak = useMemo(() => {
    const grupper = new Map<string, Journalpost[]>()
    for (const journalpost of journalposter) {
      const fagsakId = journalpost.sak?.fagsakId
      if (!fagsakId) continue
      const gruppe = grupper.get(fagsakId)
      if (gruppe) {
        gruppe.push(journalpost)
      } else {
        grupper.set(fagsakId, [journalpost])
      }
    }
    return grupper
  }, [journalposter])

  return { journalposterPerSak, isLoading, error }
}
