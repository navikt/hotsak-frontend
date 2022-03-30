import useSwr from 'swr'
import { hentBrukerdataMedPost } from '../io/http'
import { PersonoversiktType } from '../types/types.internal'

interface PersonInfoResponse {
  personInfo: PersonoversiktType | undefined
  isLoading: boolean
  isError: any
}

export function usePersonInfo(brukersFodselsnummer?: string): PersonInfoResponse {
  const { data, error } = useSwr<{ data: PersonoversiktType | undefined }>(
    brukersFodselsnummer ? ['api/personinfo' , brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  return {
    personInfo: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
