import { useParams } from 'react-router'
import useSwr from 'swr'

import { httpGet } from '../io/http'

import { Barnebrillesak, Sak } from '../types/types.internal'

interface DataResponse {
  sak: Sak | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

interface BrillesakResponse {
  sak: Barnebrillesak | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

export function useSak(): DataResponse {
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { data, error, mutate } = useSwr<{ data: Sak }>(`api/sak/${saksnummer}`, httpGet, { refreshInterval: 10_000 })

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

  const { data, error, mutate } = useSwr<{ data: Barnebrillesak }>(`api/sak/${saksnummer}`, httpGet)

  return {
    sak: data?.data,
    isLoading: !error && !data,
    isError: error,
    mutate: mutate,
  }
}
