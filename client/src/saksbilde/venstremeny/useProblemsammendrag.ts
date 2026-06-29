import useSwr from 'swr'

import { HttpError } from '../../io/HttpError.ts'
import { useSakId } from '../useSak.ts'

interface UseServiceforespørselResponse {
  sammendragMedLavere: boolean
  problemsammendrag: string
  postbegrunnelser: string[]
}

interface ServiceforespørselResponse {
  problemsammendrag: string
  postbegrunnelser: string[]
}

export function useServiceforespørsel(): UseServiceforespørselResponse {
  const sakId = useSakId()
  const { data, ...rest } = useSwr<ServiceforespørselResponse, HttpError>(
    sakId ? `/api/sak/${sakId}/serviceforesporsel` : null
  )
  return {
    sammendragMedLavere: data?.problemsammendrag?.startsWith('POST ') ?? false,
    problemsammendrag: data?.problemsammendrag ?? '',
    postbegrunnelser: data?.postbegrunnelser ?? [],
    ...rest,
  }
}
