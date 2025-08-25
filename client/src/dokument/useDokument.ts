import { useCallback, useState } from 'react'

import { http } from '../io/HttpClient.ts'
import { HttpError } from '../io/HttpError.ts'
import { byggDataRessurs, byggFeiletRessurs, byggHenterRessurs, byggTomRessurs } from '../io/ressursFunksjoner.ts'
import type { Ressurs } from '../types/types.internal.ts'

export interface UseDokumentResponse {
  hentetDokument: Ressurs<string>
  dokumentError: HttpError | null
  hentForhåndsvisning(valgtJournalpostId: string, dokumentId: string): void
  nullstillDokument(): void
}

export function useDokument(): UseDokumentResponse {
  const [hentetDokument, settHentetDokument] = useState<Ressurs<string>>(byggTomRessurs())
  const [dokumentError, setDokumentError] = useState<HttpError | null>(null)

  const nullstillDokument = () => {
    settHentetDokument(byggTomRessurs)
  }

  const hentForhåndsvisning = useCallback((valgtJournalpostId: string, dokumentId: string) => {
    settHentetDokument(byggHenterRessurs())
    setDokumentError(null)

    http
      .get<Blob>(`/api/journalpost/${valgtJournalpostId}/${dokumentId}`, { accept: 'application/pdf' })
      .then((data) => {
        settHentetDokument(byggDataRessurs(window.URL.createObjectURL(data)))
        setDokumentError(null)
      })
      .catch((error: HttpError) => {
        settHentetDokument(byggFeiletRessurs(`Ukjent feil, kunne ikke generer forhåndsvisning: ${error}`))
        setDokumentError(error)
      })
  }, [])

  return {
    hentetDokument,
    dokumentError,
    hentForhåndsvisning,
    nullstillDokument,
  }
}
