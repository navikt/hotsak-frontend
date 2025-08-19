import { useState } from 'react'

import { http } from './HttpClient.ts'
import { HttpError } from './HttpError.ts'

export interface Resultat<T> {
  data?: T
  error?: HttpError
  loading?: boolean
}

export function usePost<RequestBody, ResponseBody>(
  url: string
): { post(body: RequestBody): Promise<void>; reset(): void } & Resultat<ResponseBody> {
  const [[resultat, loading], setResultat] = useState<[Resultat<ResponseBody>, boolean]>([{}, false])
  return {
    async post(body) {
      setResultat([{}, true])
      try {
        const data = await http.post<RequestBody, ResponseBody>(url, body)
        return setResultat([{ data }, false])
      } catch (err: unknown) {
        return setResultat([{ error: HttpError.wrap(err) }, false])
      }
    },
    reset() {
      setResultat([{}, false])
    },
    ...resultat,
    loading,
  }
}
