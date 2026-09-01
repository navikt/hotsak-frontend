import useSwr, { SWRResponse } from 'swr'

import type { HttpError } from '../io/HttpError.ts'
import { type Saksdokument, SaksdokumentType } from '../types/types.internal.ts'
import { useSakId } from './useSak.ts'

interface UseSaksdokumenterResponse extends Omit<SWRResponse<Saksdokument[], HttpError>, 'data'> {
  dokumenter: Saksdokument[]
}

export function useJournalposterInngående(): UseSaksdokumenterResponse {
  const sakId = useSakId()
  const { data = ingenSaksdokumenter, ...rest } = useSwr<Saksdokument[]>(
    sakId ? `/api/sak/${sakId}/dokumenter?type=${encodeURIComponent(SaksdokumentType.INNGÅENDE)}` : null
  )
  return {
    dokumenter: data,
    ...rest,
  }
}

export function useAlleJournalposterForSak(sakId?: string): UseSaksdokumenterResponse {
  const { data: saksdokumenter = ingenSaksdokumenter, ...rest } = useSwr<Saksdokument[]>(
    sakId ? `/api/sak/${sakId}/dokumenter` : null
  )
  return {
    dokumenter: saksdokumenter,
    ...rest,
  }
}

const ingenSaksdokumenter: Saksdokument[] = []
