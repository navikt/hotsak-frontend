import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Dokument, Journalpost } from '../types/types.internal'

interface JournalpostResponse {
  journalpost: Journalpost | undefined
  isLoading: boolean
  isError: any
}

interface DokumentResponse {
  dokumenter: Dokument[]
  isLoading: boolean
  isError: any
}

export function useJournalpost(journalpostID?: string): JournalpostResponse {
  const { data, error } = useSwr<{ data: Journalpost }>(`api/journalpost/${journalpostID}`, httpGet)

  return {
    journalpost: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useJournalposter(): DokumentResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr<{ data: Dokument[] }>(`api/sak/${saksnummer}/dokumenter`, httpGet)

  return {
    dokumenter: data?.data || [],
    isLoading: !error && !data,
    isError: error,
  }
}
