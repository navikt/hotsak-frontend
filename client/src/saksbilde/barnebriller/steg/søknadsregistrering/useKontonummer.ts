import { useEffect } from 'react'

import { usePost } from '../../../../io/usePost'

import { KontonummerRequest, KontonummerResponse } from '../../../../types/types.internal'

export function useKontonummer(sakId?: string, fnr?: string) {
  const { post, data, error, loading } = usePost<KontonummerRequest, KontonummerResponse>('/api/utbetalingsmottaker')

  useEffect(() => {
    if (sakId && fnr && fnr !== '') {
      post({
        fnr: fnr,
        sakId,
      })
    }
  }, [sakId, fnr])

  return { data, error, loading }
}
