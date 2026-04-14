import useSwr, { KeyedMutator } from 'swr'
import { useSakId } from '../saksbilde/useSak'

export interface DataResponse {
  datoEkspedert: string | undefined
  error: unknown
  isLoading: boolean
  mutate: KeyedMutator<{ datoEkspedert: string | undefined }>
}

export function useUtsendingsInfo(): DataResponse {
  const sakId = useSakId()

  const { data, error, isLoading, mutate } = useSwr<{
    datoEkspedert: string | undefined
  }>(sakId ? `/api/sak/${sakId}/brev/utsendingsinfo` : null)

  return {
    datoEkspedert: data?.datoEkspedert,
    error,
    isLoading,
    mutate,
  }
}
