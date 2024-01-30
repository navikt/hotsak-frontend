import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { BarnebrillesakResponse, SakResponse } from '../types/types.internal'

interface DataResponse {
  sak: SakResponse | undefined
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
  const { data, error, isLoading, mutate } = useSwr<{ data: SakResponse }>(`api/sak/${saksnummer}`, httpGet, {
    refreshInterval: 10_000,
  })

  return {
    sak: data?.data,
    isLoading: isLoading,
    isError: error,
    mutate,
  }
}

// Duplisert frem til vi vet om de ulike sakstypene vil ha samme payload eller om det blir to ulike varianter/endepunkt
export function useBrillesak(): BrillesakResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()

  const { data, error, isLoading, mutate } = useSwr<{ data: BarnebrillesakResponse }>(
    `api/sak/${saksnummer}`,
    httpGet,
    { refreshInterval: 0 }
  )

  return {
    sak: data?.data,
    isLoading: isLoading,
    isError: error,
    mutate: mutate,
  }
}
