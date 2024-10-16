import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Innsenderbehovsmelding } from '../types/BehovsmeldingTypes'

interface DataResponse {
  behovsmelding: Innsenderbehovsmelding | undefined
  isLoading: boolean
  isError: any
}

export function useBehovsmelding(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error, isLoading } = useSwr<{ data: Innsenderbehovsmelding }>(
    `api/sak/${saksnummer}/behovsmelding`,
    httpGet
  )

  return {
    behovsmelding: data?.data,
    isLoading: isLoading,
    isError: error,
  }
}
