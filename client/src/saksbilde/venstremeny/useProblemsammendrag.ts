import useSwr, { SWRResponse } from 'swr'

import { HttpError } from '../../io/HttpError.ts'
import { useSakId } from '../useSak.ts'

interface UseProblemsammendragResponse extends Omit<SWRResponse<string, HttpError>, 'data'> {
  sammendragMedLavere: boolean
  problemsammendrag: string
}

export function useProblemsammendrag(): UseProblemsammendragResponse {
  const sakId = useSakId()
  const { data: problemsammendrag, ...rest } = useSwr<string, HttpError>(
    sakId ? `/api/sak/${sakId}/serviceforesporsel` : null
  )
  return {
    sammendragMedLavere: problemsammendrag?.startsWith('POST ') ?? false,
    problemsammendrag: problemsammendrag ?? '',
    ...rest,
  }
}
