import useSwr from 'swr'

import { http } from '../../../io/HttpClient.ts'
import type { HttpError } from '../../../io/HttpError.ts'
import { useMiljø } from '../../../utils/useMiljø.ts'
import {
  HøreapparatVedtak,
  VedtaksgrunnlagBase,
  VedtaksgrunnlagHøreapparatvedtak,
  VedtaksgrunnlagType,
} from '../../../types/types.internal.ts'
import { useErPilot } from '../../../tilgang/useTilgang.ts'

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
  const { erProd } = useMiljø()
  const erHørselshjelpemiddelPilot = useErPilot('hørselshjelpemiddel') || !erProd
  const høreapparatvedtakFraVedtak = vedtaksgrunnlag?.find(erHøreapparatVedtak)?.data
  const harHøreapparatVedtakFraVedtak = !!høreapparatvedtakFraVedtak

  const {
    data: høreapparatVedtak,
    error,
    isLoading,
  } = useSwr<HøreapparatVedtak, HttpError, [string, string] | null>(
    fnr && erHørselshjelpemiddelPilot && !erProd && !harHøreapparatVedtakFraVedtak
      ? ['/api/person/ha-vedtak', fnr]
      : null,
    ([url, fnr]) => http.post<{ fnr: string }, HøreapparatVedtak>(url, { fnr })
  )

  if (erProd) {
    return {
      høreapparatVedtak: undefined,
      isLoading: false,
      isFromVedtak: false,
    }
  }

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
  return vedtaksgrunnlag.type === VedtaksgrunnlagType.HØREAPPARATVEDTAK
}
