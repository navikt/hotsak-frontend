import { useSWRConfig } from 'swr'
import { useActionState } from '../../../action/Actions.ts'
import { baseUrl, post } from '../../../io/http'
import { FerdigstillNotatRequest, NotatType } from '../../../types/types.internal'
import { useToast } from '../../../felleskomponenter/toast/ToastContext.tsx'

export function useFerdigstillNotat() {
  const { mutate } = useSWRConfig()
  const { state, execute } = useActionState()
  const { showSuccessToast } = useToast()

  const ferdigstillNotat = async (notat: FerdigstillNotatRequest) => {
    return execute(async () => {
      await post(`${baseUrl}/api/sak/${notat.sakId}/notater/${notat.id}/ferdigstilling`, notat)
    })
  }

  const ferdigstill = async (payload: FerdigstillNotatRequest) => {
    await ferdigstillNotat(payload)
    await mutate(`/api/sak/${payload.sakId}/notater`)
    showSuccessToast(payload.type === NotatType.JOURNALFØRT ? 'Notatet er journalført' : 'Notatet er opprettet')
  }

  return {
    ferdigstiller: state.loading,
    ferdigstill,
  }
}
