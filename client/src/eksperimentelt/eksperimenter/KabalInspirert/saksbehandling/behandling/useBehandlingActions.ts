import { Actions, useActionState } from '../../../../../action/Actions.ts'
import { http } from '../../../../../io/HttpClient.ts'
import { useSakId } from '../../../../../saksbilde/useSak.ts'
import { Behandlingsutfall } from '../../../../../types/behandlingTyper.ts'
import { useBehandling } from './useBehandling.ts'

export interface BehandlingActions extends Actions {
  lagreBehandling(utfall?: Behandlingsutfall): Promise<void>
}

export function useBehandlingActions(): BehandlingActions {
  const sakId = useSakId()
  const { behandlinger, mutate: mutateBehandling } = useBehandling()
  const { execute, state } = useActionState()

  return {
    async lagreBehandling(utfall?: Behandlingsutfall): Promise<void> {
      if (behandlinger.length > 0) {
        const behandlingId = behandlinger[0].behandlingId
        return execute(async () => {
          await http.put(`/api/sak/${sakId}/behandling/${behandlingId}`, { utfall })
          await mutateBehandling()
        })
      }
      return execute(async () => {
        await http.post(`/api/sak/${sakId}/behandling`, { utfall })
        await mutateBehandling()
      })
    },
    state,
  }
}
