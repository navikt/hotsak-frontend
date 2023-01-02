import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { Button } from '@navikt/ds-react'

import { postJournalføringStartet } from '../../io/http'

import { useInnloggetSaksbehandler } from '../../state/authentication'

interface IkkeTildeltProps {
  journalpostID: string
  gåTilSak: boolean
}

export const DokumentIkkeTildelt = ({ journalpostID, gåTilSak = false }: IkkeTildeltProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const tildel = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postJournalføringStartet(journalpostID)
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        if (gåTilSak) {
          const destinationUrl = `/oppgaveliste/dokumenter/${journalpostID}`
          navigate(destinationUrl)
        } else {
          mutate(`api/journalpost/${journalpostID}`)
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
          data-cy={`btn-tildel-dokumentoppgave-${journalpostID}`}
          disabled={isFetching}
          loading={isFetching}
        >
          Start journalføring
        </Button>
      }
    </>
  )
}
