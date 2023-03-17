import { useEffect } from 'react'

import { usePost } from '../../../../io/usePost'

import { KontonummerRequest, KontonummerResponse } from '../../../../types/types.internal'

export function useKontonummer(sakId: string, fnrInnsender: string) {
  const { post, data, error, loading } = usePost<KontonummerRequest, KontonummerResponse>('/api/personinfo/kontonr')

  useEffect(() => {
    if (sakId && fnrInnsender && fnrInnsender !== '') {
      post({
        sakId,
        brukersFodselsnummer: fnrInnsender,
      })
    }
  }, [sakId, fnrInnsender])

  return { data, error, loading }
}
