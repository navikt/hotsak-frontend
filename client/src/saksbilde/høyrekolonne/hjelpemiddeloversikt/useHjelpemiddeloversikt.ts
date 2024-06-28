import useSwr from 'swr'

import { hentBrukerdataMedPost } from '../../../io/http'
import { HjelpemiddelArtikkel, Vedtaksgrunnlag, VedtaksgrunnlagType } from '../../../types/types.internal'

interface HjelpemiddeloversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[]
  isLoading: boolean
  error: any
  isFromVedtak: boolean
}

export function useHjelpemiddeloversikt(
  brukersFodselsnummer?: string,
  vedtaksgrunnlag?: Vedtaksgrunnlag[]
): HjelpemiddeloversiktResponse {
  const utlånshistorikkFraVedtak = vedtaksgrunnlag?.find((it) => it.type === VedtaksgrunnlagType.UTLAANSHISTORIKK)?.data
  const harUtlånshistorikkFraVedtak = utlånshistorikkFraVedtak !== null && utlånshistorikkFraVedtak !== undefined

  const { data, error, isLoading } = useSwr<{ data: HjelpemiddelArtikkel[] | undefined }>(
    brukersFodselsnummer && !harUtlånshistorikkFraVedtak ? ['api/hjelpemiddeloversikt', brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  if (harUtlånshistorikkFraVedtak) {
    return {
      hjelpemiddelArtikler: utlånshistorikkFraVedtak,
      error: false,
      isLoading: false,
      isFromVedtak: true,
    }
  } else {
    return {
      hjelpemiddelArtikler: data?.data || [],
      error,
      isLoading,
      isFromVedtak: false,
    }
  }
}
