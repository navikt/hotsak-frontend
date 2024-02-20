import { useParams } from 'react-router'
import useSwr from 'swr'

import { ResponseError, httpGet } from '../io/http'

import { Dokument, Journalpost } from '../types/types.internal'

interface JournalpostResponse {
  journalpost: Journalpost | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

interface DokumentResponse {
  dokumenter: Dokument[]
  isLoading: boolean
  isError: ResponseError
}

export function useJournalpost(journalpostID?: string): JournalpostResponse {
  const { data, error, mutate } = useSwr<{ data: Journalpost }>(`api/journalpost/${journalpostID}`, httpGet)

  return {
    journalpost: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate
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
