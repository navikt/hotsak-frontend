import React from 'react'
import { useParams } from 'react-router'
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
  isError: unknown
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

  return {
    dokumenter: data?.data || [],
    totalCount: data?.data.length || 0,
    isLoading: !error && !data,
    error,
    mutate,
  }
}

export function useDokument(journalpost?: string): DokumentResponse {
  const { journalpostID } = useParams<{ journalpostID: string }>()

  const valgtJournalpostID = journalpost ? journalpost : journalpostID

  const { data, error, mutate } = useSwr<{ data: Journalpost }>(`${journalpostBasePath}/${valgtJournalpostID}`, httpGet)
  //const [valgtDokumentID, settValgtDokumentID] = React.useState<string>('')
  const [hentetDokument, settHentetDokument] = React.useState<Ressurs<string>>(byggTomRessurs())

  const nullstillDokument = () => {
    settHentetDokument(byggTomRessurs)
  }

  const hentForhåndsvisning = (valgtJournalpostID: string, dokumentID: string) => {
    settHentetDokument(byggHenterRessurs())

    const pdfResponse = httpGetPdf(`${journalpostBasePath}/${valgtJournalpostID}/${dokumentID}`)

    pdfResponse
      .then((response: PDFResponse) => {
        settHentetDokument(byggDataRessurs(window.URL.createObjectURL(response.data)))
      })
      .catch((error: any) => {
        settHentetDokument(byggFeiletRessurs(`Ukjent feil, kunne ikke generer forhåndsvisning: ${error}`))
      })
  }

  return {
    journalpost: data?.data,
    isLoading: !error && !data,
    isError: error,
    hentForhåndsvisning,
    nullstillDokument,
    hentetDokument,
    settHentetDokument,
    mutate,
  }
}
