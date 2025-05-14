import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { Sakstype } from '../../types/types.internal'
import { useOppgaveService } from '../../oppgave/OppgaveService.ts'
import type { HttpError } from '../../io/HttpError.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'

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
  const saksbehandler = useInnloggetAnsatt()
  const { endreOppgavetildeling } = useOppgaveService()
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
    endreOppgavetildeling({ overtaHvisTildelt: false })
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
      .catch((e: HttpError) => {
        if (e.isConflict()) {
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
