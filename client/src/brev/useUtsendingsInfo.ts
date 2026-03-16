import useSwr, { KeyedMutator } from 'swr'
import { useSakId } from '../saksbilde/useSak'
import { UtsendingsInfo } from './brevTyper'

export interface DataResponse {
  utsendingsinfo: UtsendingsInfo | undefined
  datoEkspedert: string | undefined
  harUtsendingsInfo: boolean
  error: unknown
  isLoading: boolean
  mutate: KeyedMutator<{ utsendingsinfo: UtsendingsInfo; datoEkspedert: string | undefined }>
}

export function useUtsendingsInfo(): DataResponse {
  const sakId = useSakId()

  const { data, error, isLoading, mutate } = useSwr<{
    utsendingsinfo: UtsendingsInfo
    datoEkspedert: string | undefined
  }>(sakId ? `/api/sak/${sakId}/brev/utsendingsinfo` : null)

  return {
    utsendingsinfo: data?.utsendingsinfo,
    datoEkspedert: data?.datoEkspedert,
    harUtsendingsInfo: !!data?.utsendingsinfo,
    error,
    isLoading,
    mutate,
  }
}
