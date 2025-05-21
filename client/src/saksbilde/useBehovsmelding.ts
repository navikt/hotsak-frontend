import useSwr from 'swr'

import { httpGet } from '../io/http'
import type { Innsenderbehovsmelding } from '../types/BehovsmeldingTypes'
import { useSakId } from './useSak.ts'

interface DataResponse {
  behovsmelding: Innsenderbehovsmelding | undefined
  isLoading: boolean
  isError: any
}

export function useBehovsmelding(): DataResponse {
  const sakId = useSakId()
  const { data, error, isLoading } = useSwr<{ data: Innsenderbehovsmelding }>(
    sakId ? `api/sak/${sakId}/behovsmelding` : null,
    httpGet
  )

  return {
    behovsmelding: data?.data,
    isLoading: isLoading,
    isError: error,
  }
}
