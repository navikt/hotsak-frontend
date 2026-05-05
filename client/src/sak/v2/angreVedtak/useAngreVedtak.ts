import { useNavigate } from 'react-router-dom'
import { Actions, useActionState } from '../../../action/Actions'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { http } from '../../../io/HttpClient'
import { useOppgave } from '../../../oppgave/useOppgave'
import { mutateSak } from '../../../saksbilde/mutateSak'
import { useBehandling } from '../behandling/useBehandling'
import { useBrevutkast } from '../../../brev/useBrevutkast'
import { useBrevMetadata } from '../../../brev/useBrevMetadata'

export interface AngreResponse {
  nyOppgaveId: string
}

export interface AngreActions extends Actions {
  angreVedtak({ årsak }: { årsak: string }): Promise<void>
}

export function useAngreVedtak(): AngreActions {
  const { oppgave } = useOppgave()
  const { versjon, sakId } = oppgave ?? {}
  const { gjeldendeBehandling, mutate: mutateBehandling } = useBehandling()
  const { execute, state } = useActionState()
  const { showSuccessToast } = useToast()
  const navigate = useNavigate()
  const { brevutkast } = useBrevutkast()
  const { mutate: mutateBrevMetadata } = useBrevMetadata()

  return {
    async angreVedtak({ årsak }: { årsak: string }) {
      if (!sakId || !gjeldendeBehandling) return
      return execute(async () => {
        await http.delete(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV/ferdigstilling`)
        const response = await http.post<unknown, AngreResponse>(
          `/api/sak/${sakId}/behandling/${gjeldendeBehandling.behandlingId}/angring`,
          { årsak },
          { versjon }
        )
        await mutateBehandling()
        await mutateSak(sakId)
        await brevutkast.mutate(undefined, { revalidate: true })
        await mutateBrevMetadata()
        showSuccessToast('Vedtaket er angret og ny oppgave er aktiv')
        navigate(`/oppgave/${response.nyOppgaveId}`)
      })
    },
    state,
  }
}
