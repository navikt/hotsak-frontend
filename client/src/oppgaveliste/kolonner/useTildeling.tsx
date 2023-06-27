import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { postTildeling } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { useInnloggetSaksbehandler } from '../../state/authentication'

export function useTildeling({ sakId, gåTilSak = false }: { sakId: string; gåTilSak: boolean }) {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()

  const onTildel = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (gåTilSak) {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_OPPGAVELISTE)
    } else {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_SAK)
    }

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postTildeling(sakId)
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
    onTildel,
  }
}
