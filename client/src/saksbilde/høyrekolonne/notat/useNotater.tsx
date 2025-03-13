import useSwr from 'swr'
import { useErNotatPilot } from '../../../state/authentication'
import { Notat } from '../../../types/types.internal'
import { KeyedMutator } from 'swr'

interface NotaterResponse {
  notater: Notat[]
  utkast: Notat[]
  isLoading: boolean
  mutate: KeyedMutator<Notat[]>
}

export function useNotater(sakId?: string): NotaterResponse {
  const erNotatPilot = useErNotatPilot()

  const {
    data: notater,
    mutate,
    isLoading,
  } = useSwr<Notat[]>(erNotatPilot && sakId ? `/api/sak/${sakId}/notater?tekst=true` : null)

  const utkast = notater?.filter((notat) => !notat.ferdigstilt) ?? []

  return {
    notater: notater?.filter((notat) => notat.ferdigstilt) ?? [],
    utkast,
    isLoading,
    mutate,
  }
}
