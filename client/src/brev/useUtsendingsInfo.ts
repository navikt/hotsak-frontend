import useSwr, { KeyedMutator } from 'swr'
import { useSakId } from '../saksbilde/useSak'
import { UtsendingsInfo } from './brevTyper'

export interface DataResponse {
  utsendingsinfo: UtsendingsInfo | undefined
  harUtsendingsInfo: boolean
  error: unknown
  isLoading: boolean
  mutate: KeyedMutator<{ utsendingsinfo: UtsendingsInfo }>
}

export function useUtsendingsInfo(): DataResponse {
  const sakId = useSakId()

  const { data, error, isLoading, mutate } = useSwr<{ utsendingsinfo: UtsendingsInfo }>(
    sakId ? `/api/sak/${sakId}/brev/utsendingsinfo` : null
  )

  return {
    utsendingsinfo: data?.utsendingsinfo,
    harUtsendingsInfo: !!data?.utsendingsinfo,
    error,
    isLoading,
    mutate,
  }
}
