import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { BarnebrillesakResponse, Sakresponse } from '../types/types.internal'

interface DataResponse {
  sak: Sakresponse | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

interface BrillesakResponse {
  sak: BarnebrillesakResponse | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

export function useSak(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error, mutate } = useSwr<{ data: Sakresponse }>(`api/sak/${saksnummer}`, httpGet, {
    refreshInterval: 10_000,
  })

  return {
    sak: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

// Duplisert frem til vi vet om de ulike sakstypene vil ha samme payload eller om det blir to ulike varianter/endepunkt
export function useBrillesak(): BrillesakResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()

  const { data, error, mutate } = useSwr<{ data: BarnebrillesakResponse }>(`api/sak/${saksnummer}`, httpGet)

  return {
    sak: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }
}
