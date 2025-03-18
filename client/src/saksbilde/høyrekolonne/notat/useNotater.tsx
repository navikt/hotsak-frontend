import useSwr from 'swr'
import { useErNotatPilot } from '../../../state/authentication'
import { Notat, Saksnotater } from '../../../types/types.internal'
import { KeyedMutator } from 'swr'

interface NotaterResponse {
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
  } = useSwr<Saksnotater>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater?tekst=true` : null)

  const notater = saksnotater?.notater
  const utkast = notater?.filter((notat) => !notat.ferdigstilt) ?? []

  return {
    notater: notater?.filter((notat) => notat.ferdigstilt) ?? [],
    utkast,
    isLoading,
    mutate,
  }
}
