import useSwr from 'swr'
import { hentHjelpemiddeloversikt } from '../../../io/http'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'

interface HjelpemiddeloversiktResponse {
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
  isLoading: boolean
  isError: any
}

export function useHjelpemiddeloversikt(brukersFødselsnummer?: string): HjelpemiddeloversiktResponse {
  const { data, error } = useSwr<{ data: HjelpemiddelArtikkel[] | undefined }>(
    brukersFødselsnummer ? ['api/hjelpemiddeloversikt' , brukersFødselsnummer] : null,
    hentHjelpemiddeloversikt
  )

  return {
    hjelpemiddelArtikler: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
