import { Actions, useActionState } from '../../../action/Actions'
import { http } from '../../../io/HttpClient'
import { useOppgave } from '../../../oppgave/useOppgave'
import { mutateSak } from '../../../saksbilde/mutateSak'
import { useBehandling } from '../behandling/useBehandling'

export interface AngreActions extends Actions {
  angreVedtak(): Promise<void>
}

export function useAngreVedtak(): AngreActions {
  const { oppgave } = useOppgave()
  const { versjon, sakId } = oppgave ?? {}
  const { gjeldendeBehandling, mutate: mutateBehandling } = useBehandling()
  const { execute, state } = useActionState()

  return {
    async angreVedtak() {
      if (!sakId || !gjeldendeBehandling) return
      return execute(async () => {
        await http.post(`/api/sak/${sakId}/behandling/${gjeldendeBehandling.behandlingId}/angre`, { versjon })
        await mutateBehandling()
        await mutateSak(sakId)
      })
    },
    state,
  }
}
