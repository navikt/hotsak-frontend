import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { Button } from '@navikt/ds-react'

import { postOppgaveTildeling } from '../io/http'
import { useInnloggetSaksbehandler } from '../state/authentication'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'
import { OppgaveV2, Oppgavetype } from '../types/types.internal'

interface OppgaveIkkeTildeltProps {
  oppgave: OppgaveV2
  gåTilSak: boolean
}

export const OppgaveIkkeTildelt = ({ oppgave, gåTilSak = false }: OppgaveIkkeTildeltProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const { oppgavetype, sakId, journalpostId } = oppgave
  const oppgavereferanse = (oppgavetype === Oppgavetype.JOURNALFØRING ? journalpostId : sakId) || ''

  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const tildel = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (gåTilSak) {
      logAmplitudeEvent(amplitude_taxonomy.OPPGAVE_STARTET_FRA_OPPGAVELISTE)
    } else {
      logAmplitudeEvent(amplitude_taxonomy.OPPGAVE_STARTET_FRA_SAK)
    }

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postOppgaveTildeling(oppgavereferanse.toString())
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        if (gåTilSak) {
          const destinationUrl =
            oppgavetype === Oppgavetype.JOURNALFØRING ? `/oppgaveliste/dokumenter/${journalpostId}` : `/sak/${sakId}/`
          navigate(destinationUrl)
        } else {
          // TODO vet ikke helt hva vi skal gjøre her enda. Når man er inne på en sak/oppgave, skal vi gå til et felles
          // oppgavebilde eller skal det rutes til forskjellige steder basert på oppgavetype
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
          Ta oppgave
        </Button>
      }
    </>
  )
}
