import useSwr from 'swr'
import { useErNotatPilot } from '../../../state/authentication'
import type { Notat } from '../../../types/types.internal'

interface NotatTellerResponse {
  antallNotater: number
  harUtkast: boolean
  isLoading: boolean
  mutate: (...args: any[]) => any
}

export function useNotatTeller(sakId?: string): NotatTellerResponse {
  const erNotatPilot = useErNotatPilot()

  const {
    data: notater,
    mutate,
    isLoading,
  } = useSwr<Notat[]>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater?tekst=false` : null)

  const utkast = notater?.filter((notat) => !notat.ferdigstilt) ?? []

  return {
    antallNotater: notater?.length ?? 0,
    harUtkast: utkast.length > 0,
    isLoading,
    mutate,
  }
}
