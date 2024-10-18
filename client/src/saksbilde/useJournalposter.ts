import { useParams } from 'react-router'
import useSwr from 'swr'
import type { Dokument } from '../types/types.internal'
import { httpGet, ResponseError } from '../io/http'

interface JournalposterResponse {
  dokumenter: Dokument[]
  isLoading: boolean
  isError: ResponseError
}

export function useJournalposter(): JournalposterResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr<{ data: Dokument[] }>(`api/sak/${saksnummer}/dokumenter`, httpGet)

  return {
    dokumenter: data?.data || ingenDokumenter,
    isLoading: !error && !data,
    isError: error,
  }
}

const ingenDokumenter: Dokument[] = []
