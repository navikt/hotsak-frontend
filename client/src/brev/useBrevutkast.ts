import useSWR from 'swr'
import { StateMangement } from './breveditor/Breveditor'
import { useSakId } from '../saksbilde/useSak'

export function useBrevutkast() {
  const sakId = useSakId()

  const brevutkast = useSWR<
    {
      error?: string
      data?: StateMangement
      ferdigstilt: boolean
      opprettet: string
    },
    Error
  >(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV`, async (key: string) =>
    fetch(key, { method: 'get' }).then((res) => res.json())
  )

  return { brevutkast }
}
