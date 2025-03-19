import useSwr from 'swr'
import { useErNotatPilot } from '../../../state/authentication'
import { Notat, NotatType, Saksnotater } from '../../../types/types.internal'
import { KeyedMutator } from 'swr'

interface NotaterResponse {
  antallNotater: number
  harUtkast: boolean
  notater: Notat[]
  avventerJournalføring: boolean
  utkast: Notat[]
  isLoading: boolean
  mutate: KeyedMutator<Saksnotater>
}

export function useNotater(sakId?: string, opts?: any): NotaterResponse {
  const erNotatPilot = useErNotatPilot()

  const {
    data: saksnotater,
    mutate,
    isLoading,
  } = useSwr<Saksnotater>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater` : null, opts)

  const { notater, totalElements } = saksnotater ?? { notater: [], totalElements: 0 }
  const ferdigstilteNotater = notater?.filter((notat) => notat.ferdigstilt) ?? []
  const utkast = notater?.filter((notat) => !notat.ferdigstilt) ?? []
  const avventerJournalføring =
    ferdigstilteNotater
      .filter((notat) => notat.type === NotatType.JOURNALFØRT)
      .filter((notat) => !notat.journalpostId || !notat.dokumentId).length > 0

  console.log('Har notater som avventer journalføring? ', avventerJournalføring, opts)

  return {
    antallNotater: totalElements,
    harUtkast: utkast.length > 0,
    notater: ferdigstilteNotater,
    avventerJournalføring,
    utkast,
    isLoading,
    mutate,
  }
}
