import useSWRImmutable from 'swr/immutable'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type KontonummerRequest, type KontonummerResponse } from '../types/types.internal.ts'

type KontonummerKey = ['/api/utbetalingsmottaker', string, string]

function hentKontonummer([url, sakId, fnr]: KontonummerKey) {
  return http.post<KontonummerRequest, KontonummerResponse>(url, { sakId, fnr })
}

export function useKontonummer(sakId?: string, fnr?: string) {
  const key: KontonummerKey | null = sakId && fnr ? ['/api/utbetalingsmottaker', sakId, fnr] : null
  const { data, error, isLoading } = useSWRImmutable<KontonummerResponse, HttpError>(key, hentKontonummer)

  return {
    data,
    error,
    loading: isLoading,
    manglerKontonummer: data !== undefined && !data.kontonummer,
  }
}
