import useSwr from 'swr'

import { http } from '../../../io/HttpClient.ts'
import type { HttpError } from '../../../io/HttpError.ts'
import {
  HjelpemiddelArtikkel,
  HøreapparatVedtak,
  VedtaksgrunnlagBase,
  VedtaksgrunnlagHøreapparatvedtak,
  VedtaksgrunnlagType,
} from '../../../types/types.internal.ts'
import { useMiljø } from '../../../utils/useMiljø.ts'
import { useErPilot } from '../../../tilgang/useTilgang.ts'
import { useUtlånoversikt } from './useUtlånoversikt.ts'

export interface UseHjelpemiddeloversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[]
  antallUtlånteHjelpemidler: number
  høreapparatVedtak: HøreapparatVedtak | undefined
  errorHjmOversikt?: HttpError
  errorHaVedtak?: HttpError
  isLoadingHjmOversikt: boolean
  isLoadingHaVedtak: boolean
  isFromVedtak: boolean
}

export function useHjelpemiddeloversikt(
  fnr?: string,
  vedtaksgrunnlag?: VedtaksgrunnlagBase[]
): UseHjelpemiddeloversiktResponse {
  const {
    hjelpemiddelArtikler,
    antallUtlånteHjelpemidler,
    error: errorHjmOversikt,
    isLoading: isLoadingHjmOversikt,
    isFromVedtak,
  } = useUtlånoversikt(fnr, vedtaksgrunnlag)

  const { erProd } = useMiljø()
  const erHørselshjelpemiddelPilot = useErPilot('hørselshjelpemiddel') || !erProd
  const høreapparatvedtakFraVedtak = vedtaksgrunnlag?.find(erHøreapparatVedtak)?.data

  const {
    data: høreapparatVedtak,
    error: errorHaVedtak,
    isLoading: isLoadingHaVedtak,
  } = useSwr<HøreapparatVedtak, HttpError, [string, string] | null>(
    fnr && erHørselshjelpemiddelPilot && !erProd && !isFromVedtak ? ['/api/person/ha-vedtak', fnr] : null,
    ([url, fnr]) => http.post<{ fnr: string }, HøreapparatVedtak>(url, { fnr })
  )

  if (isFromVedtak) {
    return {
      hjelpemiddelArtikler,
      antallUtlånteHjelpemidler,
      høreapparatVedtak: høreapparatvedtakFraVedtak,
      errorHjmOversikt: undefined,
      errorHaVedtak: undefined,
      isLoadingHjmOversikt: false,
      isLoadingHaVedtak: false,
      isFromVedtak: true,
    }
  }

  return {
    hjelpemiddelArtikler,
    antallUtlånteHjelpemidler,
    høreapparatVedtak,
    errorHjmOversikt,
    errorHaVedtak,
    isLoadingHjmOversikt,
    isLoadingHaVedtak,
    isFromVedtak: false,
  }
}

function erHøreapparatVedtak(
  vedtaksgrunnlag: VedtaksgrunnlagBase
): vedtaksgrunnlag is VedtaksgrunnlagHøreapparatvedtak {
  return vedtaksgrunnlag.type === VedtaksgrunnlagType.HØREAPPARATVEDTAK
}
