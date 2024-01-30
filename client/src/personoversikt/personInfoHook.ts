import useSwr from 'swr'

import { hentBrukerdataMedPost } from '../io/http'

import { Person } from '../types/types.internal'

interface PersonInfoResponse {
  personInfo: Person | undefined
  isLoading: boolean
  isError: any
}

export function usePersonInfo(brukersFodselsnummer?: string): PersonInfoResponse {
  const { data, error } = useSwr<{ data: Person | undefined }>(
    brukersFodselsnummer ? ['api/person', brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  return {
    personInfo: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
