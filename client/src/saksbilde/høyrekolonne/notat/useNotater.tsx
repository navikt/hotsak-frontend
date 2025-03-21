import useSwr from 'swr'
import { useErNotatPilot } from '../../../state/authentication'
import { Notat, NotatType, Saksnotater } from '../../../types/types.internal'
import { KeyedMutator } from 'swr'
import { useEffect, useState } from 'react'

interface NotaterResponse {
  antallNotater: number
  harUtkast: boolean
  notater: Notat[]
  utkast: Notat[]
  isLoading: boolean
  mutate: KeyedMutator<Saksnotater>
}

export function useNotater(sakId?: string, opts?: any): NotaterResponse {
  const erNotatPilot = useErNotatPilot()

  const [refreshInterval, setRefreshInterval] = useState(0)

  const {
    data: saksnotater,
    mutate,
    isLoading,
  } = useSwr<Saksnotater>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater` : null, { refreshInterval })

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
  const utkast = notater?.filter((notat) => !notat.ferdigstilt) ?? []
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
    harUtkast: utkast.length > 0,
    notater: ferdigstilteNotater,
    utkast,
    isLoading,
    mutate,
  }
}
