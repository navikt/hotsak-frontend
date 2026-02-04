import useSwr, { KeyedMutator } from 'swr'
import { BrevMetadata } from './brevTyper'
import { useSakId } from '../saksbilde/useSak'

export interface DataResponse {
  brev: BrevMetadata[]
  gjeldendeBrev?: BrevMetadata
  harBrevISak: boolean
  error: any
  isLoading: boolean
  mutate: KeyedMutator<DataResponse>
}

export function useBrevMetadata(): DataResponse {
  const sakId = useSakId()

  const { data, error, isLoading, mutate } = useSwr<DataResponse>(sakId ? `/api/sak/${sakId}/brev` : null)
  const brevData = data?.brev || []

  return {
    brev: brevData,
    gjeldendeBrev: brevData[0],
    harBrevISak: brevData.length > 0,
    error,
    isLoading,
    mutate,
  }
}
