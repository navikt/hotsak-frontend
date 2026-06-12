import useSwr, { useSWRConfig, type SWRResponse } from 'swr'

import { type HttpError } from '../../../io/HttpError.ts'
import { useSakId } from '../../../saksbilde/useSak.ts'
import { type Behandling, type BehandlingerForSak } from './behandlingTyper.ts'

export interface UseBehandlingResponse
  extends Omit<SWRResponse<BehandlingerForSak, HttpError>, 'data'>, BehandlingerForSak {
  gjeldendeBehandling?: Behandling
}

export function useBehandling(): UseBehandlingResponse {
  const sakId = useSakId()

  const { data = ingenBehandlinger, ...rest } = useSwr<BehandlingerForSak>(
    sakId ? `/api/sak/${sakId}/behandling` : null
  )

  return {
    behandlinger: data.behandlinger,
    gjeldendeBehandling: data.behandlinger[0],
    ...rest,
  }
}

const ingenBehandlinger: BehandlingerForSak = {
  behandlinger: [],
}

export function useMutateBehandling() {
  const { mutate } = useSWRConfig()
  return (sakId: string) => mutate<BehandlingerForSak>(`/api/sak/${sakId}/behandling`)
}
