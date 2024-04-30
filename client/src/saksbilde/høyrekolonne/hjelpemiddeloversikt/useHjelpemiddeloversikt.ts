import useSwr from 'swr'

import { hentBrukerdataMedPost } from '../../../io/http'

import { HjelpemiddelArtikkel, Vedtaksgrunnlag, VedtaksgrunnlagType } from '../../../types/types.internal'

interface HjelpemiddeloversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
  isLoading: boolean
  isError: any
  isFromVedtak: boolean
}

export function useHjelpemiddeloversikt(
  brukersFodselsnummer?: string,
  vedtaksgrunnlag?: Vedtaksgrunnlag[]
): HjelpemiddeloversiktResponse {
  const utlaanshistorikkFraVedtak = vedtaksgrunnlag?.find(
    (it) => it.type === VedtaksgrunnlagType.UTLAANSHISTORIKK
  )?.data
  const harUtlaanshistorikkFraVedtak = utlaanshistorikkFraVedtak !== null && utlaanshistorikkFraVedtak !== undefined

  const { data, error } = useSwr<{ data: HjelpemiddelArtikkel[] | undefined }>(
    brukersFodselsnummer && !harUtlaanshistorikkFraVedtak ? ['api/hjelpemiddeloversikt', brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  if (harUtlaanshistorikkFraVedtak) {
    return {
      hjelpemiddelArtikler: utlaanshistorikkFraVedtak,
      isLoading: false,
      isError: false,
      isFromVedtak: true,
    }
  } else {
    return {
      hjelpemiddelArtikler: data?.data,
      isLoading: !error && !data,
      isError: error,
      isFromVedtak: false,
    }
  }
}
