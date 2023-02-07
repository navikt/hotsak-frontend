import { useEffect } from 'react'

import { usePost } from '../../../../io/usePost'

import { KontonummerRequest, KontonummerResponse } from '../../../../types/types.internal'

export function useKontonummer(fnr?: string): KontonummerResponse | undefined {
  const { post, data, reset } = usePost<KontonummerRequest, KontonummerResponse>('/api/personinfo/kontonr')

  useEffect(() => {
    if (fnr) {
      post({
        brukersFodselsnummer: fnr,
      }).catch((e) => {
        console.log(e)
        reset()
      })
    }
  }, [fnr])

  return data
}
