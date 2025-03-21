import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { postTildeling, ResponseError } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { useInnloggetSaksbehandler } from '../../state/authentication'
import { Sakstype } from '../../types/types.internal'

export function useTildeling({
  sakId,
  gåTilSak = false,
  sakstype,
  onTildelingKonflikt,
}: {
  sakId: string
  gåTilSak: boolean
  sakstype?: Sakstype
  onTildelingKonflikt: () => void
}) {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()

  const onTildel = (event: MouseEvent) => {
    event.stopPropagation()

    if (gåTilSak) {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_OPPGAVELISTE)
    } else {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_SAK)
    }

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postTildeling(sakId, {}, false)
      .then(() => {
        setIsFetching(false)
        if (gåTilSak) {
          const destinationUrl =
            sakstype === Sakstype.SØKNAD || sakstype === Sakstype.BESTILLING
              ? `/sak/${sakId}/hjelpemidler`
              : `/sak/${sakId}`
          navigate(destinationUrl)
        } else {
          mutate(`api/sak/${sakId}`)
          mutate(`api/sak/${sakId}/historikk`)
        }
      })
      .catch((e: ResponseError) => {
        if (e.statusCode == 409) {
          onTildelingKonflikt()
        } else {
          setIsFetching(false)
        }
      })
  }

  return {
    onTildel,
  }
}
