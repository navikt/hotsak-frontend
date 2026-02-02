import useSwr from 'swr'

import { HttpError } from '../../io/HttpError.ts'
import { useSakId } from '../useSak.ts'

interface UseProblemsammendragResponse {
  sammendragMedLavere: boolean
  problemsammendrag: string
}

interface ProblemsammendragResponse {
  problemsammendrag: string
}

export function useProblemsammendrag(): UseProblemsammendragResponse {
  const sakId = useSakId()
  const { data, ...rest } = useSwr<ProblemsammendragResponse, HttpError>(
    sakId ? `/api/sak/${sakId}/serviceforesporsel` : null
  )
  return {
    sammendragMedLavere: data?.problemsammendrag?.startsWith('POST ') ?? false,
    problemsammendrag: data?.problemsammendrag ?? '',
    ...rest,
  }
}
