import useSwr from 'swr'

import { http } from '../../../io/HttpClient.ts'
import type { HttpError } from '../../../io/HttpError.ts'
import {
  HjelpemiddelArtikkel,
  VedtaksgrunnlagBase,
  VedtaksgrunnlagType,
  VedtaksgrunnlagUtlånsoversikt,
} from '../../../types/types.internal.ts'

export interface UseUtlånsoversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[]
  antallUtlånteHjelpemidler: number
  error?: HttpError
  isLoading: boolean
  isFromVedtak: boolean
}

export function useUtlånoversikt(fnr?: string, vedtaksgrunnlag?: VedtaksgrunnlagBase[]): UseUtlånsoversiktResponse {
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
      antallUtlånteHjelpemidler: antallUtlånteHjelpemidler(utlånshistorikkFraVedtak),
      isLoading: false,
      isFromVedtak: true,
    }
  }

  return {
    hjelpemiddelArtikler,
    antallUtlånteHjelpemidler: antallUtlånteHjelpemidler(hjelpemiddelArtikler),
    error,
    isLoading,
    isFromVedtak: false,
  }
}

function erUtlånshistorikk(vedtaksgrunnlag: VedtaksgrunnlagBase): vedtaksgrunnlag is VedtaksgrunnlagUtlånsoversikt {
  return vedtaksgrunnlag.type === VedtaksgrunnlagType.UTLAANSHISTORIKK
}

function antallUtlånteHjelpemidler(artikler: HjelpemiddelArtikkel[]) {
  return artikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)
}
