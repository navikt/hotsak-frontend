import useSwr from 'swr'

import type { Dokument } from '../types/types.internal'
import { httpGet } from '../io/http'
import type { HttpError } from '../io/HttpError.ts'
import { useSakId } from './useSak.ts'

interface JournalposterResponse {
  dokumenter: Dokument[]
  isLoading: boolean
  error: HttpError
}

export function useJournalposter(): JournalposterResponse {
  const sakId = useSakId()
  const { data, error } = useSwr<{ data: Dokument[] }>(sakId ? `api/sak/${sakId}/dokumenter` : null, httpGet)

  return {
    dokumenter: data?.data || ingenDokumenter,
    isLoading: !error && !data,
    error,
  }
}

const ingenDokumenter: Dokument[] = []
