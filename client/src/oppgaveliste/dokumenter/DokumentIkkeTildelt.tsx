import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'

import { Button } from '@navikt/ds-react'

import { postJournalføringStartet } from '../../io/http'
import { useInnloggetSaksbehandler } from '../../state/authentication'

export interface DokumentIkkeTildeltProps {
  oppgaveId: string
  journalpostId: string
  gåTilSak: boolean
}

export function DokumentIkkeTildelt({ oppgaveId, journalpostId, gåTilSak = false }: DokumentIkkeTildeltProps) {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const tildel = (event: MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postJournalføringStartet(oppgaveId)
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        if (gåTilSak) {
          const destinationUrl = `/oppgaveliste/dokumenter/${journalpostId}`
          navigate(destinationUrl)
        } else {
          mutate(`api/journalpost/${journalpostId}`)
        }
      })
  }

  return (
    <Button
      size={gåTilSak ? 'xsmall' : 'small'}
      variant={gåTilSak ? 'tertiary' : 'secondary'}
      onClick={tildel}
      disabled={isFetching}
      loading={isFetching}
    >
      Start journalføring
    </Button>
  )
}
