import useSwr from 'swr'

import { http } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import type { Person } from '../types/types.internal'

export interface PersonResponse {
  personInfo?: Person
  error?: HttpError
  isLoading: boolean
}

export function usePerson(fnr?: string): PersonResponse {
  const {
    data: personInfo,
    error,
    isLoading,
  } = useSwr<Person, HttpError>(fnr ? ['/api/person', fnr] : null, ([url, fnr]: [string, string]) => {
    return http.post<{ fnr: string }, Person>(url, { fnr })
  })

  return {
    personInfo,
    error,
    isLoading,
  }
}
