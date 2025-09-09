import { useEffect, useState } from 'react'
import useSwr, { KeyedMutator } from 'swr'

import { HttpError } from '../../../io/HttpError.ts'
import { Notat, NotatType, Saksnotater } from '../../../types/types.internal.ts'

interface NotaterResponse {
  antallNotater: number
  harUtkast: boolean
  notater: Notat[]
  mutate: KeyedMutator<Saksnotater>
  isLoading: boolean
  harLastet: boolean
  finnAktivtUtkast(valgtType?: NotatType): Notat | undefined
}

export function useNotater(sakId?: string): NotaterResponse {
  const [refreshInterval, setRefreshInterval] = useState(0)
  const [harUtkast, setHarUtkast] = useState(false)
  const {
    data: saksnotater,
    error,
    mutate,
    isLoading,
  } = useSwr<Saksnotater, HttpError>(sakId ? `/api/sak/${sakId}/notater` : null, { refreshInterval })

  useEffect(() => {
    if (saksnotater) {
      const utkast = saksnotater.notater.filter((notat) => !notat.ferdigstilt)
      setHarUtkast(utkast.length > 0)
    }
  }, [saksnotater])

  const finnAktivtUtkast = (valgtType?: NotatType): Notat | undefined => {
    return saksnotater?.notater.filter((notat) => !notat.ferdigstilt).find((notat) => notat.type === valgtType)
  }

  const { notater, totalElements } = saksnotater ?? { notater: [], totalElements: 0 }
  const ferdigstilteNotater = notater?.filter((notat) => notat.ferdigstilt) ?? []

  const avventerJournalføring =
    ferdigstilteNotater
      .filter((notat) => notat.type === NotatType.JOURNALFØRT)
      .filter((notat) => !notat.journalpostId || !notat.dokumentId).length > 0

  useEffect(() => {
    if (avventerJournalføring) {
      setRefreshInterval(2000)
    } else {
      setRefreshInterval(0)
    }
  }, [avventerJournalføring])

  return {
    antallNotater: totalElements,
    harUtkast,
    notater: ferdigstilteNotater,
    mutate,
    isLoading,
    harLastet: !isLoading && (saksnotater != null || error != null),
    finnAktivtUtkast,
  }
}
