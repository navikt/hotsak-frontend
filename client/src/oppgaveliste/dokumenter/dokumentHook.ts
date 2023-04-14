import React, { useState } from 'react'
import useSwr from 'swr'

import { httpGet, httpGetPdf, PDFResponse } from '../../io/http'

import { Journalpost, Ressurs } from '../../types/types.internal'
import { byggDataRessurs, byggFeiletRessurs, byggHenterRessurs, byggTomRessurs } from './ressursFunksjoner'

interface DokumentlisteResponse {
  dokumenter: Journalpost[]
  totalCount: number
  isLoading: boolean
  error: unknown
  mutate: (...args: any[]) => any
}

interface DokumentResponse {
  journalpost: Journalpost | undefined
  isLoading: boolean
  isError: any
  isPdfError: any
  hentForhåndsvisning: (journalpostID: string, dokumentID: string) => any
  nullstillDokument: () => any
  hentetDokument: any
  settHentetDokument: any
  mutate: (...args: any[]) => any
}

const dokumentlisteBasePath = 'api/journalposter'
const journalpostBasePath = 'api/journalpost'

export function useDokumentListe(): DokumentlisteResponse {
  const { data, error, mutate } = useSwr<{ data: Journalpost[] }>(dokumentlisteBasePath, httpGet, {
    refreshInterval: 10000,
  })

  // Avventer å legge inn dette til vi ser om vi trenger filter, paging osv
  /*useEffect(() => {
        logAmplitudeEvent(amplitude_taxonomy.DOKUMENTLISTE_OPPDATERT, {
          currentPage,
          ...sort,
          ...filters,
        })
      }, [currentPage, sort, filters])*/

  const dokumenter = data?.data || []
  return {
    dokumenter,
    totalCount: dokumenter.length,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

export function useDokument(journalpostID?: string): DokumentResponse {
  //const { journalpostID } = useParams<{ journalpostID: string }>()

  //const valgtJournalpostID = journalpost ? journalpost : journalpostID

  const { data, error, mutate } = useSwr<{ data: Journalpost }>(`${journalpostBasePath}/${journalpostID}`, httpGet)
  //const [valgtDokumentID, settValgtDokumentID] = React.useState<string>('')
  const [hentetDokument, settHentetDokument] = React.useState<Ressurs<string>>(byggTomRessurs())
  const [isPdfError, setIsPdfError] = useState<any>(null)

  const nullstillDokument = () => {
    settHentetDokument(byggTomRessurs)
  }

  const hentForhåndsvisning = (valgtJournalpostID: string, dokumentID: string) => {
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
  }

  return {
    journalpost: data?.data,
    isLoading: !error && !data,
    isError: error,
    isPdfError,
    hentForhåndsvisning,
    nullstillDokument,
    hentetDokument,
    settHentetDokument,
    mutate,
  }
}
