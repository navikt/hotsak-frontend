import useSwr, { KeyedMutator } from 'swr'

import { useEffect, useState } from 'react'
import { useErNotatPilot } from '../../../tilgang/useTilgang.ts'
import { Notat, NotatType, Saksnotater } from '../../../types/types.internal'

interface NotaterResponse {
  antallNotater: number
  harUtkast: boolean
  notater: Notat[]
  aktivtUtkast?: Notat
  isLoading: boolean
  mutate: KeyedMutator<Saksnotater>
}

export function useNotater(sakId: string, valgtNotattype?: NotatType, opts?: any): NotaterResponse {
  const erNotatPilot = useErNotatPilot()

  const [refreshInterval, setRefreshInterval] = useState(0)
  const [harUtkast, setHarUtkast] = useState(false)
  const [aktivtUtkast, setAktivtUtkast] = useState<Notat | undefined>(undefined)
  const {
    data: saksnotater,
    mutate,
    isLoading,
  } = useSwr<Saksnotater>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater` : null, { refreshInterval })

  useEffect(() => {
    console.log('useEffect i useNotater')

    if (saksnotater) {
      const utkast = saksnotater.notater.filter((notat) => !notat.ferdigstilt)
      setHarUtkast(utkast.length > 0)
      // TODO egen funksjon for dette
      if (valgtNotattype) {
        const utkastForType = utkast.find((notat) => notat.type === valgtNotattype)
        if (utkastForType) {
          setAktivtUtkast(utkastForType)
        }
      }
    }
  }, [saksnotater, valgtNotattype])

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
    aktivtUtkast,
    isLoading,
    mutate,
  }
}
