import { useEffect } from 'react'

import { usePost } from '../../../../io/usePost'

interface KontonummerResponse {
  kontohaver: string
  kontonummer: string
}

interface KontonummerRequest {
  kontohaver: string
}

export function useKontonummer(fnr?: string): KontonummerResponse | undefined {
  const { post, data, reset } = usePost<KontonummerRequest, KontonummerResponse>('/api/personinfo/kontonr')

  useEffect(() => {
    if (fnr) {
      post({
        kontohaver: fnr,
      }).catch((e) => {
        console.log(e)
        reset()
      })
    }
  }, [fnr])

  return data
}
