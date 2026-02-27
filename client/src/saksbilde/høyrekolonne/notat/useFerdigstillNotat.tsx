import { useSWRConfig } from 'swr'

import { useActionState } from '../../../action/Actions.ts'
import { useToast } from '../../../felleskomponenter/toast/ToastContext.tsx'
import { http } from '../../../io/HttpClient.ts'
import { FerdigstillNotatRequest, NotatType } from '../../../types/types.internal'

export function useFerdigstillNotat() {
  const { mutate } = useSWRConfig()
  const { state, execute } = useActionState()

  const { showSuccessToast } = useToast()

  const ferdigstillNotat = (request: FerdigstillNotatRequest) =>
    execute(() => http.post(`/api/sak/${request.sakId}/notater/${request.id}/ferdigstilling`, request))

  const ferdigstill = async (payload: FerdigstillNotatRequest) => {
    await ferdigstillNotat(payload)
    await mutate(`/api/sak/${payload.sakId}/notater`)
    // TODO usikker på om det gir mening å oppdatere behandling her,er det bedre å sjekke dette på notater enn gjenstående på behandling?
    await mutate(`/api/sak/${payload.sakId}/behandling`)

    showSuccessToast(payload.type === NotatType.JOURNALFØRT ? 'Notatet er journalført' : 'Notatet er opprettet')
  }

  return {
    ferdigstiller: state.loading,
    ferdigstill,
  }
}
