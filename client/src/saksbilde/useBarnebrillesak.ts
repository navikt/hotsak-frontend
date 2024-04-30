import { useParams } from 'react-router'
import useSwr from 'swr'

import type { BarnebrillesakResponse } from '../types/types.internal'
import { httpGet } from '../io/http'

interface DataResponse {
  sak: BarnebrillesakResponse | undefined
  isLoading: boolean
  isError: any
  mutate: (...args: any[]) => any
}

// Duplisert frem til vi vet om de ulike sakstypene vil ha samme payload eller om det blir to ulike varianter/endepunkt
export function useBarnebrillesak(): DataResponse {
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
