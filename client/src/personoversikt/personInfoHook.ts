import useSwr from 'swr'

import { hentBrukerdataMedPost } from '../io/http'

import { Adressebeskyttelse, Person } from '../types/types.internal'

interface PersonInfoResponse {
  personInfo: Person | undefined
  isLoading: boolean
  isError: any
}

export function usePersonInfo(brukersFodselsnummer?: string): PersonInfoResponse {
  const { data, error } = useSwr<{ data: Person | undefined }>(
    brukersFodselsnummer ? ['api/personinfo', brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  return {
    personInfo: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}

export function useTilgangsattributterPerson(brukersFodselsnummer?: string) {
  const { data, error } = useSwr<{
    data:
      | {
          adressebeskyttelseGradering: Adressebeskyttelse[]
          erSkjermetPerson: boolean
        }
      | undefined
  }>(brukersFodselsnummer ? ['api/personinfo/tilgangsattributter', brukersFodselsnummer] : null, hentBrukerdataMedPost)

  return {
    attributter: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
