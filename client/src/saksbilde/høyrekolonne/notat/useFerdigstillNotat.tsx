import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { baseUrl, post } from '../../../io/http'
import { useServiceState } from '../../../service/Service'
import { FerdigstillNotatRequest } from '../../../types/types.internal'

export function useFerdigstillNotat() {
  const { mutate } = useSWRConfig()
  const [visFerdigstiltToast, setVisFerdigstiltToast] = useState(false)
  const { state, execute } = useServiceState()

  const ferdigstillNotat = async (notat: FerdigstillNotatRequest) => {
    return execute(async () => {
      await post(`${baseUrl}/api/sak/${notat.sakId}/notater/${notat.id}/ferdigstilling`, notat)
    })
  }

  const ferdigstill = async (payload: FerdigstillNotatRequest) => {
    await ferdigstillNotat(payload)
    await mutate(`/api/sak/${payload.sakId}/notater`)
    setVisFerdigstiltToast(true)
    setTimeout(() => setVisFerdigstiltToast(false), 3000)
  }

  return {
    ferdigstiller: state.loading,
    visFerdigstiltToast,
    ferdigstill,
  }
}
