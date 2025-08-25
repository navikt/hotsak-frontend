import useSwr from 'swr'

import { http } from '../../../io/HttpClient.ts'
import type { HttpError } from '../../../io/HttpError.ts'
import { HjelpemiddelArtikkel, Vedtaksgrunnlag, VedtaksgrunnlagType } from '../../../types/types.internal'

interface HjelpemiddeloversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[]
  error?: HttpError
  isLoading: boolean
  isFromVedtak: boolean
}

export function useHjelpemiddeloversikt(
  fnr?: string,
  vedtaksgrunnlag?: Vedtaksgrunnlag[]
): HjelpemiddeloversiktResponse {
  const utlånshistorikkFraVedtak = vedtaksgrunnlag?.find((it) => it.type === VedtaksgrunnlagType.UTLAANSHISTORIKK)?.data
  const harUtlånshistorikkFraVedtak = utlånshistorikkFraVedtak !== null && utlånshistorikkFraVedtak !== undefined

  const {
    data: hjelpemiddelArtikler = [],
    error,
    isLoading,
  } = useSwr<HjelpemiddelArtikkel[], HttpError>(
    fnr && !harUtlånshistorikkFraVedtak ? ['/api/hjelpemiddeloversikt', fnr] : null,
    ([url, fnr]: [string, string]) => {
      return http.post<{ fnr: string }, HjelpemiddelArtikkel[]>(url, { fnr })
    }
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
