import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../../io/http'

import { Journalpost } from '../../types/types.internal'

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

export function useDokument(): DokumentResponse {
  const { journalpostID } = useParams<{ journalpostID: string }>()
  const { data, error, mutate } = useSwr<{ data: Journalpost }>(`${journalpostBasePath}/${journalpostID}`, httpGet)

  return {
    journalpost: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
