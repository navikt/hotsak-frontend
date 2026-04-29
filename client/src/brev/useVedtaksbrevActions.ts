import { useCallback } from 'react'
import { http } from '../io/HttpClient.ts'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'
import type { StateMangement } from './breveditor/Breveditor.tsx'
import { useSakId } from '../saksbilde/useSak.ts'

interface UseVedtaksbrevActionsParams {
  onSuccess?: () => void
}

export function useVedtaksbrevActions({ onSuccess }: UseVedtaksbrevActionsParams) {
  const { oppgaveId } = useOppgaveContext()
  const sakId = useSakId()

  const lagreBrevutkast = useCallback(
    async (data: StateMangement) => {
      const res = await http.post(`/api/sak/${sakId}/brevutkast`, {
        oppgaveId,
        brevtype: 'BREVEDITOR_VEDTAKSBREV',
        målform: 'BOKMÅL',
        data,
      })
      onSuccess?.()
      return res
    },
    [sakId, oppgaveId, onSuccess]
  )

  const ferdigstillBrevutkast = useCallback(async () => {
    await http.post(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV/ferdigstilling`)
    onSuccess?.()
  }, [sakId, onSuccess])

  const gjenåpneBrevutkast = useCallback(async () => {
    await http.delete(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV/ferdigstilling`)
    onSuccess?.()
  }, [sakId, onSuccess])

  return { lagreBrevutkast, ferdigstillBrevutkast, gjenåpneBrevutkast }
}
