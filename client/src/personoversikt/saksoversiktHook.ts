import useSwr from 'swr'
import { hentBrukerdataMedPost } from '../io/http'
import { Saksoversikt_Sak } from '../types/types.internal'

interface SaksoversiktResponse {
  saksoversikt: Saksoversikt_Sak[] | undefined
  isLoading: boolean
  isError: any
}

export function useSaksoversikt(brukersFodselsnummer?: string): SaksoversiktResponse {
  const { data, error } = useSwr<{ data: Saksoversikt_Sak[] | undefined }>(
    brukersFodselsnummer ? ['api/saksoversikt' , brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )

  return {
    saksoversikt: data?.data,
    isLoading: !error && !data,
    isError: error,
  }
}
