import useSwr from 'swr'
import { hentBrukerdataMedPost } from '../io/http'
import { SaksoversiktType } from '../types/types.internal'

interface SaksoversiktResponse {
  saksoversikt: SaksoversiktType | undefined
  isLoading: boolean
  isError: any
}

export function useSaksoversikt(brukersFodselsnummer?: string): SaksoversiktResponse {
  const { data, error } = useSwr<{ data: SaksoversiktType | undefined }>(
    brukersFodselsnummer ? ['api/saksoversikt' , brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  return {
    saksoversikt: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
