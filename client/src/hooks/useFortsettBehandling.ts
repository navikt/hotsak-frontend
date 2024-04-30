import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { putOppdaterStatus } from '../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

import { useInnloggetSaksbehandler } from '../state/authentication'
import { OppgaveStatusType } from '../types/types.internal'

export function useFortsettBehandling({ sakId, gåTilSak = false }: { sakId: string; gåTilSak: boolean }) {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()

  const onFortsettBehandling = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (gåTilSak) {
      logAmplitudeEvent(amplitude_taxonomy.FORTSETT_BEHANDLING_FRA_OPPGAVELISTE)
    } else {
      logAmplitudeEvent(amplitude_taxonomy.FORTSETT_BEHANDLING_FRA_SAK)
    }

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
          mutate(`api/sak/${sakId}`)
          mutate(`api/sak/${sakId}/historikk`)
        }
      })
  }

  return {
    onFortsettBehandling,
    isFetching,
  }
}
