import useSwr, { KeyedMutator } from 'swr'

import { useSakId } from '../../../../../saksbilde/useSak.ts'
import { BehandlingerForSak } from '../../../../../types/behandlingTyper.ts'

export interface Dataesponse extends BehandlingerForSak {
  error: any
  isLoading: boolean
  mutate: KeyedMutator<Dataesponse>
}

export function useBehandling(): Dataesponse {
  const sakId = useSakId()
  const {
    data: behandling,
    error,
    isLoading,
    mutate,
  } = useSwr<Dataesponse>(sakId ? `/api/sak/${sakId}/behandling` : null)

  return {
    behandlinger: behandling?.behandlinger || [],
    gjeldendeBehandling: behandling?.behandlinger[0],
    error,
    isLoading,
    mutate,
  }
}
