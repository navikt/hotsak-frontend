import useSwr, { KeyedMutator } from 'swr'

import { useSakId } from '../../../saksbilde/useSak.ts'
import { BehandlingerForSak } from './behandlingTyper.ts'

export interface DataResponse extends BehandlingerForSak {
  error: any
  isLoading: boolean
  mutate: KeyedMutator<DataResponse>
}

export function useBehandling(): DataResponse {
  const sakId = useSakId()

  const {
    data: behandling,
    error,
    isLoading,
    mutate,
  } = useSwr<DataResponse>(sakId ? `/api/sak/${sakId}/behandling` : null)

  return {
    behandlinger: behandling?.behandlinger || [],
    gjeldendeBehandling: behandling?.behandlinger[0],
    error,
    isLoading,
    mutate,
  }
}
