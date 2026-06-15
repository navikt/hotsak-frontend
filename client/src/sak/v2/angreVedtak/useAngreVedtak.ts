import { useNavigate } from 'react-router-dom'

import { type Actions, useActionState } from '../../../action/Actions'
import { useMutateBrevForSak } from '../../../brev/useBrev'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { http } from '../../../io/HttpClient'
import { useOppgave } from '../../../oppgave/useOppgave'
import { mutateSak } from '../../../saksbilde/mutateSak'
import { useBehandling } from '../behandling/useBehandling'

export interface AngreResponse {
  nyOppgaveId: string
}

export interface AngreActions extends Actions {
  angreVedtak({ årsak }: { årsak: string }): Promise<void>
}

// todo -> bytt til useSWRMutation
export function useAngreVedtak(): AngreActions {
  const { oppgave } = useOppgave()
  const { versjon, sakId } = oppgave ?? {}
  const mutateBrevForSak = useMutateBrevForSak()
  const { gjeldendeBehandling, mutate: mutateBehandling } = useBehandling()
  const { execute, state } = useActionState()
  const { showSuccessToast } = useToast()
  const navigate = useNavigate()
  // const { brevutkast } = { brevutkast: { mutate: () => {} } } // fixme

  return {
    async angreVedtak({ årsak }: { årsak: string }) {
      if (!sakId || !gjeldendeBehandling) return
      return execute(async () => {
        const response = await http.post<unknown, AngreResponse>(
          `/api/sak/${sakId}/behandling/${gjeldendeBehandling.behandlingId}/angring`,
          { årsak },
          { versjon }
        )
        await mutateBehandling()
        await mutateSak(sakId)
        // fixme -> await brevutkast.mutate(undefined, { revalidate: true })
        await mutateBrevForSak(sakId)
        showSuccessToast('Vedtaket er angret og ny oppgave er aktiv')
        navigate(`/oppgave/${response.nyOppgaveId}`)
      })
    },
    state,
  }
}
