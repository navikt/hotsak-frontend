import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { Button, Loader } from '@navikt/ds-react'

import { postTildeling, tildelBestilling } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { useInnloggetSaksbehandler } from '../../state/authentication'

interface BestillingIkkeTildeltProps {
  oppgavereferanse: string
  gåTilBestilling: boolean
}

export const BesillingIkkeTildelt = ({ oppgavereferanse, gåTilBestilling = false }: BestillingIkkeTildeltProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const history = useHistory()
  const { mutate } = useSWRConfig()
  const tildel = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (gåTilBestilling) {
      logAmplitudeEvent(amplitude_taxonomy.BESTILLING_STARTET_FRA_OPPGAVELISTE)
    } else {
      logAmplitudeEvent(amplitude_taxonomy.BESTILLING_STARTET_FRA_BESTILLINGSBILDE)
    }

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    tildelBestilling(oppgavereferanse)
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        if (gåTilBestilling) {
          const destinationUrl = `/bestilling/${oppgavereferanse}/hjelpemidler`
          history.push(destinationUrl)
        } else {
          mutate(`api/bestilling/${oppgavereferanse}`)
          mutate(`api/bestilling/${oppgavereferanse}/historikk`)
        }
      })
  }

  return (
    <>
      {
        <Button
          size={gåTilBestilling ? 'xsmall' : 'small'}
          variant={gåTilBestilling ? 'tertiary' : 'secondary'}
          onClick={tildel}
          data-cy={`btn-tildel-sak-${oppgavereferanse}`}
        >
          Start saken
          {isFetching && <Loader size="small" />}
        </Button>
      }
    </>
  )
}
