import { useParams } from 'react-router'
import useSwr from 'swr'

import type { Dokument } from '../types/types.internal'
import { httpGet } from '../io/http'
import type { HttpError } from '../io/HttpError.ts'

interface JournalposterResponse {
  dokumenter: Dokument[]
  isLoading: boolean
  error: HttpError
}

export function useJournalposter(): JournalposterResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error } = useSwr<{ data: Dokument[] }>(`api/sak/${saksnummer}/dokumenter`, httpGet)

  return {
    dokumenter: data?.data || ingenDokumenter,
    isLoading: !error && !data,
    error,
  }
}

const ingenDokumenter: Dokument[] = []
