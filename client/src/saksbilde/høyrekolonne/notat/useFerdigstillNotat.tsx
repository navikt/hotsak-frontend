import { useSWRConfig } from 'swr'

import { useActionState } from '../../../action/Actions.ts'
import { FerdigstillNotatRequest, NotatType } from '../../../types/types.internal'
import { useToast } from '../../../felleskomponenter/toast/ToastContext.tsx'
import { http } from '../../../io/HttpClient.ts'
import { useMiljø } from '../../../utils/useMiljø.ts'

export function useFerdigstillNotat() {
  const { mutate } = useSWRConfig()
  const { state, execute } = useActionState()
  const { erIkkeProd } = useMiljø()

  const { showSuccessToast } = useToast()

  const ferdigstillNotat = (request: FerdigstillNotatRequest) =>
    execute(() => http.post(`/api/sak/${request.sakId}/notater/${request.id}/ferdigstilling`, request))

  const ferdigstill = async (payload: FerdigstillNotatRequest) => {
    await ferdigstillNotat(payload)
    await mutate(`/api/sak/${payload.sakId}/notater`)
    if (erIkkeProd) {
      await mutate(`/api/sak/${payload.sakId}/behandling`)
    }

    showSuccessToast(payload.type === NotatType.JOURNALFØRT ? 'Notatet er journalført' : 'Notatet er opprettet')
  }

  return {
    ferdigstiller: state.loading,
    ferdigstill,
  }
}
