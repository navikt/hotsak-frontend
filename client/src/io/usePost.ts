import { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'

import { HttpError } from './error'

export interface Resultat<T> {
  data?: T
  error?: HttpError
  loading?: boolean
}

export function usePost<B, T>(url: string): { post(body: B): Promise<void>; reset(): void } & Resultat<T> {
  const [[resultat, loading], setResultat] = useState<[Resultat<T>, boolean]>([{}, false])
  useErrorHandler(resultat.error)
  return {
    async post(body) {
      setResultat([{}, true])
      const resultat = await http.post<B, T>(url, body)
      setResultat([resultat, false])
    },
    reset() {
      setResultat([{}, false])
    },
    ...resultat,
    loading,
  }
}

const http = {
  async post<B, T>(path: string, body: B): Promise<Resultat<T>> {
    try {
      const url = apiUrl(path)
      const response = await fetch(url, {
        method: 'post',
        cache: 'no-store',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (response.ok) {
        const data = await response.json()
        return { data }
      }
      return {
        error: HttpError.kallFeilet(url, response),
      }
    } catch (err: unknown) {
      return {
        error: HttpError.wrap(err),
      }
    }
  },
}

export function baseUrl(url = '') {
  if (process.env.NODE_ENV === 'production') {
    return `/hjelpemidler/barnebriller${url}`
  } else {
    return url
  }
}

export function apiUrl(url: string) {
  return baseUrl(`/api${url}`)
}
