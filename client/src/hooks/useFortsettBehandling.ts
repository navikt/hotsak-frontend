import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { putOppdaterStatus } from '../io/http'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { OppgaveStatusType } from '../types/types.internal'

export function useFortsettBehandling({ sakId, gåTilSak = false }: { sakId: string; gåTilSak: boolean }) {
  const saksbehandler = useInnloggetAnsatt()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()

  const onFortsettBehandling = (event: MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    putOppdaterStatus(sakId, OppgaveStatusType.TILDELT_SAKSBEHANDLER)
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        if (gåTilSak) {
          const destinationUrl = `/sak/${sakId}`
          navigate(destinationUrl)
        } else {
          return Promise.all([mutate(`/api/sak/${sakId}`), mutate(`/api/sak/${sakId}/historikk`)])
        }
      })
  }

  return {
    onFortsettBehandling,
    isFetching,
  }
}
