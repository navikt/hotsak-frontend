import { useCallback, useState } from 'react'

import { httpGetPdf, PDFResponse } from '../io/http'
import type { Ressurs } from '../types/types.internal'
import { byggDataRessurs, byggFeiletRessurs, byggHenterRessurs, byggTomRessurs } from '../io/ressursFunksjoner'

export interface DokumentResponse {
  isPdfError: any
  hentForhåndsvisning: (journalpostID: string, dokumentID: string) => any
  nullstillDokument: () => any
  hentetDokument: any
  settHentetDokument: any
}

const journalpostBasePath = 'api/journalpost'

export function useDokument(): DokumentResponse {
  const [hentetDokument, settHentetDokument] = useState<Ressurs<string>>(byggTomRessurs())
  const [isPdfError, setIsPdfError] = useState<any>(null)

  const nullstillDokument = () => {
    settHentetDokument(byggTomRessurs)
  }

  const hentForhåndsvisning = useCallback((valgtJournalpostID: string, dokumentID: string) => {
    settHentetDokument(byggHenterRessurs())
    setIsPdfError(null)

    const pdfResponse = httpGetPdf(`${journalpostBasePath}/${valgtJournalpostID}/${dokumentID}`)

    pdfResponse
      .then((response: PDFResponse) => {
        settHentetDokument(byggDataRessurs(window.URL.createObjectURL(response.data)))
        setIsPdfError(null)
      })
      .catch((error: any) => {
        settHentetDokument(byggFeiletRessurs(`Ukjent feil, kunne ikke generer forhåndsvisning: ${error}`))
        setIsPdfError(error)
      })
  }, [])
  return {
    isPdfError,
    hentForhåndsvisning,
    nullstillDokument,
    hentetDokument,
    settHentetDokument,
  }
}
