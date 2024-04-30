import useSwr from 'swr'

import { hentBrukerdataMedPost } from '../io/http'

import { Person } from '../types/types.internal'

export interface PersonInfoResponse {
  personInfo: Person | undefined
  isLoading: boolean
  isError: any
}

export function usePersonInfo(fnr?: string): PersonInfoResponse {
  const { data, error } = useSwr<{ data: Person | undefined }>(fnr ? ['api/person', fnr] : null, hentBrukerdataMedPost)

  return {
    personInfo: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
