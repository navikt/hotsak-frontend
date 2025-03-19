import useSwr from 'swr'
import { useErNotatPilot } from '../../../state/authentication'
import { Notat, Saksnotater } from '../../../types/types.internal'
import { KeyedMutator } from 'swr'

interface NotaterResponse {
  antallNotater: number
  harUtkast: boolean
  notater: Notat[]
  utkast: Notat[]
  isLoading: boolean
  mutate: KeyedMutator<Saksnotater>
}

export function useNotater(sakId?: string): NotaterResponse {
  const erNotatPilot = useErNotatPilot()

  const {
    data: saksnotater,
    mutate,
    isLoading,
  } = useSwr<Saksnotater>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater` : null)

  const { notater, totalElements } = saksnotater ?? { notater: [], totalElements: 0 }
  const utkast = notater?.filter((notat) => !notat.ferdigstilt) ?? []

  return {
    antallNotater: totalElements,
    harUtkast: utkast.length > 0,
    notater: notater?.filter((notat) => notat.ferdigstilt) ?? [],
    utkast,
    isLoading,
    mutate,
  }
}
