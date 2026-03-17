import useSwr from 'swr'

import { http } from '../../../io/HttpClient.ts'
import type { HttpError } from '../../../io/HttpError.ts'
import {
  HøreapparatVedtak,
  VedtaksgrunnlagBase,
  VedtaksgrunnlagHøreapparatvedtak,
  VedtaksgrunnlagType,
} from '../../../types/types.internal.ts'

export interface UseHøreapparatVedtakResponse {
  høreapparatVedtak: HøreapparatVedtak | undefined
  error?: HttpError
  isLoading: boolean
  isFromVedtak: boolean
}

export function useHøreapparatVedtak(
  fnr?: string,
  vedtaksgrunnlag?: VedtaksgrunnlagBase[]
): UseHøreapparatVedtakResponse {
  const høreapparatvedtakFraVedtak = vedtaksgrunnlag?.find(erHøreapparatVedtak)?.data
  const harHøreapparatVedtakFraVedtak = !!høreapparatvedtakFraVedtak

  const {
    data: høreapparatVedtak,
    error,
    isLoading,
  } = useSwr<HøreapparatVedtak, HttpError, [string, string] | null>(
    fnr && !harHøreapparatVedtakFraVedtak ? ['/api/ha-vedtak', fnr] : null,
    ([url, fnr]) => http.post<{ fnr: string }, HøreapparatVedtak>(url, { fnr })
  )

  if (harHøreapparatVedtakFraVedtak) {
    return {
      høreapparatVedtak: høreapparatvedtakFraVedtak,
      isLoading: false,
      isFromVedtak: true,
    }
  }

  return {
    høreapparatVedtak,
    error,
    isLoading,
    isFromVedtak: false,
  }
}

function erHøreapparatVedtak(
  vedtaksgrunnlag: VedtaksgrunnlagBase
): vedtaksgrunnlag is VedtaksgrunnlagHøreapparatvedtak {
  return vedtaksgrunnlag.type === VedtaksgrunnlagType.HØREAPPARAT_VEDTAK
}
