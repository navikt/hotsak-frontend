import { useCallback, useMemo } from 'react'
import useSwr, { KeyedMutator } from 'swr'

import { HttpError } from '../../io/HttpError.ts'
import { isAvventerJournalføring, isNotatFerdigstilt, isNotatType, isNotatUtkast } from './notatSelectors.ts'
import { type Notat, NotatType, type Saksnotater } from './notatTyper.ts'

export interface UseNotaterResponse {
  antallNotater: number
  harUtkast: boolean
  notater: Notat[]
  mutate: KeyedMutator<Saksnotater>
  isLoading: boolean
  harLastet: boolean
  finnAktivtUtkast(valgtType?: NotatType): Notat | undefined
}

export function useNotater(sakId?: string): UseNotaterResponse {
  const { data, error, mutate, isLoading } = useSwr<Saksnotater, HttpError>(
    sakId ? `/api/sak/${sakId}/notater` : null,
    {
      refreshInterval(latestData) {
        if (!latestData) return 0
        const avventerJournalføring = latestData.notater.some(isAvventerJournalføring)
        return avventerJournalføring ? 2000 : 0
      },
    }
  )

  const { notater, totalElements } = data ?? noData

  const harUtkast = useMemo(() => notater.some(isNotatUtkast), [notater])
  const ferdigstilteNotater = useMemo(() => notater.filter(isNotatFerdigstilt), [notater])
  const finnAktivtUtkast = useCallback(
    (valgtType?: NotatType): Notat | undefined => notater.filter(isNotatUtkast).find(isNotatType(valgtType)),
    [notater]
  )

  return {
    antallNotater: totalElements,
    harUtkast,
    notater: ferdigstilteNotater,
    mutate,
    isLoading,
    harLastet: !isLoading && (data != null || error != null),
    finnAktivtUtkast,
  }
}

const noData: Saksnotater = { notater: [], totalElements: 0 }
