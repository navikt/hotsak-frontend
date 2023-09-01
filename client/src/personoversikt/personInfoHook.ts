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

  // Midlertidig workaround for å håndtere at endepunk for tilgangsatributter ikke er i prod enda på grunn av
  // feilsøking rundt problemer med Micronaut og database connections
  ///if (window.appSettings.MILJO === 'prod-gcp') {
  //console.log('Vi er i prod ')
  return {
    attributter: undefined,
    isLoading: undefined,
    isError: undefined,
  }
  /* } else {
    console.log('Vi er ikke i prod, henter tilgangsattributter fra eget endepunkt')
    return {
      attributter: data?.data,
      isLoading: !error && !data,
      isError: error,
    }
  }*/
}
