import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { Button } from '@navikt/ds-react'

import { postTildeling } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { useInnloggetSaksbehandler } from '../../state/authentication'

interface IkkeTildeltProps {
  oppgavereferanse: number | string
  gåTilSak: boolean
}

export const IkkeTildelt = ({ oppgavereferanse, gåTilSak = false }: IkkeTildeltProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const tildel = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (gåTilSak) {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_OPPGAVELISTE)
    } else {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_SAK)
    }

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postTildeling(oppgavereferanse)
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        if (gåTilSak) {
          const destinationUrl = `/sak/${oppgavereferanse}/hjelpemidler`
          navigate(destinationUrl)
        } else {
          mutate(`api/sak/${oppgavereferanse}`)
          mutate(`api/sak/${oppgavereferanse}/historikk`)
        }
      })
  }

  return (
    <>
      {
        <Button
          size={gåTilSak ? 'xsmall' : 'small'}
          variant={gåTilSak ? 'tertiary' : 'secondary'}
          onClick={tildel}
          name="Ta saken"
          disabled={isFetching}
          loading={isFetching}
        >
          Ta saken
        </Button>
      }
    </>
  )
}
