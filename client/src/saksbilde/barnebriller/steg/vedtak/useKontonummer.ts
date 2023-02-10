import { useEffect } from 'react'

import { usePost } from '../../../../io/usePost'

import { KontonummerRequest, KontonummerResponse } from '../../../../types/types.internal'

export function useKontonummer(sakId?: string, fnr?: string): KontonummerResponse | undefined {
  const { post, data, reset } = usePost<KontonummerRequest, KontonummerResponse>('/api/personinfo/kontonr')

  useEffect(() => {
    if (fnr && sakId) {
      post({
        brukersFodselsnummer: fnr,
        sakId,
      }).catch((e) => {
        console.log(e)
        reset()
      })
    }
  }, [fnr])

  return data
}
