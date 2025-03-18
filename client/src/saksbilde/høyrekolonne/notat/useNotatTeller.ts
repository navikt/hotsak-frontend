import useSwr from 'swr'
import { useErNotatPilot } from '../../../state/authentication'
import type { Saksnotater } from '../../../types/types.internal'

interface NotatTellerResponse {
  antallNotater: number
  harUtkast: boolean
  isLoading: boolean
  mutate: (...args: any[]) => any
}

export function useNotatTeller(sakId?: string): NotatTellerResponse {
  const erNotatPilot = useErNotatPilot()

  const {
    data: saksnotater,
    mutate,
    isLoading,
  } = useSwr<Saksnotater>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater?tekst=false` : null)
  const { notater, totalElements } = saksnotater ?? { notater: [], totalElements: 0 }

  const utkast = notater?.filter((notat) => !notat.ferdigstilt) ?? []

  return {
    antallNotater: totalElements,
    harUtkast: utkast.length > 0,
    isLoading,
    mutate,
  }
}
