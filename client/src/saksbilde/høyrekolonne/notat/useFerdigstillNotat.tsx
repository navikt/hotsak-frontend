import { useState } from 'react'
import { useSWRConfig } from 'swr'

import { useActionState } from '../../../action/Actions.ts'
import { http } from '../../../io/HttpClient.ts'
import type { FerdigstillNotatRequest } from '../../../types/types.internal.ts'

export function useFerdigstillNotat() {
  const { mutate } = useSWRConfig()
  const [visFerdigstiltToast, setVisFerdigstiltToast] = useState(false)
  const { state, execute } = useActionState()

  const ferdigstillNotat = async (request: FerdigstillNotatRequest) => {
    return execute(() => http.post(`/api/sak/${request.sakId}/notater/${request.id}/ferdigstilling`, request))
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
