import useSwr, { KeyedMutator } from 'swr'

import { useEffect, useState } from 'react'
import { useErNotatPilot } from '../../../tilgang/useTilgang.ts'
import { Notat, NotatType, Saksnotater } from '../../../types/types.internal'

interface NotaterResponse {
  antallNotater: number
  harUtkast: boolean
  notater: Notat[]
  finnAktivtUtkast: (valgtNotattype?: NotatType) => Notat | undefined
  isLoading: boolean
  mutate: KeyedMutator<Saksnotater>
}

export function useNotater(sakId?: string, opts?: any): NotaterResponse {
  const erNotatPilot = useErNotatPilot()

  const [refreshInterval, setRefreshInterval] = useState(0)
  const [harUtkast, setHarUtkast] = useState(false)
  const {
    data: saksnotater,
    mutate,
    isLoading,
  } = useSwr<Saksnotater>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater` : null, { refreshInterval })

  useEffect(() => {
    if (saksnotater) {
      const utkast = saksnotater.notater.filter((notat) => !notat.ferdigstilt)
      setHarUtkast(utkast.length > 0)
    }
  }, [saksnotater])

  const finnAktivtUtkast = (valgtNotattype?: NotatType): Notat | undefined => {
    return saksnotater?.notater.filter((notat) => !notat.ferdigstilt).find((notat) => notat.type === valgtNotattype)
  }

  opts = {
    ...opts,
    refreshInterval: saksnotater?.notater.some(
      (notat) => notat.type === NotatType.JOURNALFØRT && (!notat.journalpostId || !notat.dokumentId)
    )
      ? 5000
      : 0,
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
    finnAktivtUtkast,
    isLoading,
    mutate,
  }
}
