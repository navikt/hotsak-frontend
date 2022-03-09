import useSwr from 'swr'
import { hentBrukerdataMedPost } from '../../../io/http'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'

interface HjelpemiddeloversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
  isLoading: boolean
  isError: any
}

export function useHjelpemiddeloversikt(brukersFodselsnummer?: string): HjelpemiddeloversiktResponse {
  const { data, error } = useSwr<{ data: HjelpemiddelArtikkel[] | undefined }>(
    brukersFodselsnummer ? ['api/hjelpemiddeloversikt' , brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  return {
    hjelpemiddelArtikler: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
