import useSwr from 'swr'

import { http } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import type { Person } from '../types/types.internal'

export interface UsePersonResponse {
  personInfo?: Person
  error?: HttpError
  isLoading: boolean
}

export function usePerson(fnr?: string): UsePersonResponse {
  const {
    data: personInfo,
    error,
    isLoading,
  } = useSwr<Person, HttpError, [string, string] | null>(fnr ? ['/api/person', fnr] : null, ([url, fnr]) =>
    http.post<{ fnr: string }, Person>(url, { fnr })
  )

  return {
    personInfo,
    error,
    isLoading,
  }
}
