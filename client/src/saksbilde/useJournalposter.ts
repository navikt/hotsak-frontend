import useSwr, { SWRResponse } from 'swr'

import type { HttpError } from '../io/HttpError.ts'
import type { Dokument } from '../types/types.internal.ts'
import { useSakId } from './useSak.ts'

interface UseJournalposterResponse extends Omit<SWRResponse<Dokument[], HttpError>, 'data'> {
  dokumenter: Dokument[]
}

export function useJournalposter(): UseJournalposterResponse {
  const sakId = useSakId()
  const { data: dokumenter = ingenDokumenter, ...rest } = useSwr<Dokument[]>(
    sakId ? `/api/sak/${sakId}/dokumenter` : null
  )
  return {
    dokumenter,
    ...rest,
  }
}

const ingenDokumenter: Dokument[] = []
