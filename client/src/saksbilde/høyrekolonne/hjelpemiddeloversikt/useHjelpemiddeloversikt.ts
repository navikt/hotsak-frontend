import useSwr from 'swr'

import { http } from '../../../io/HttpClient.ts'
import type { HttpError } from '../../../io/HttpError.ts'
import {
  HjelpemiddelArtikkel,
  VedtaksgrunnlagBase,
  VedtaksgrunnlagType,
  VedtaksgrunnlagUtlånsoversikt,
} from '../../../types/types.internal'

export interface UseHjelpemiddeloversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[]
  error?: HttpError
  isLoading: boolean
  isFromVedtak: boolean
}

export function useHjelpemiddeloversikt(
  fnr?: string,
  vedtaksgrunnlag?: VedtaksgrunnlagBase[]
): UseHjelpemiddeloversiktResponse {
  const utlånshistorikkFraVedtak = vedtaksgrunnlag?.find(erUtlånshistorikk)?.data
  const harUtlånshistorikkFraVedtak = utlånshistorikkFraVedtak !== null && utlånshistorikkFraVedtak !== undefined

  const {
    data: hjelpemiddelArtikler = [],
    error,
    isLoading,
  } = useSwr<HjelpemiddelArtikkel[], HttpError, [string, string] | null>(
    fnr && !harUtlånshistorikkFraVedtak ? ['/api/hjelpemiddeloversikt', fnr] : null,
    ([url, fnr]) => http.post<{ fnr: string }, HjelpemiddelArtikkel[]>(url, { fnr })
  )

  if (harUtlånshistorikkFraVedtak) {
    return {
      hjelpemiddelArtikler: utlånshistorikkFraVedtak,
      isLoading: false,
      isFromVedtak: true,
    }
  }

  return {
    hjelpemiddelArtikler,
    error,
    isLoading,
    isFromVedtak: false,
  }
}

function erUtlånshistorikk(vedtaksgrunnlag: VedtaksgrunnlagBase): vedtaksgrunnlag is VedtaksgrunnlagUtlånsoversikt {
  return vedtaksgrunnlag.type === VedtaksgrunnlagType.UTLAANSHISTORIKK
}
