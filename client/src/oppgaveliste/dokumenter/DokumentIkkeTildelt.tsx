import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'
import { Button } from '@navikt/ds-react'

import { postOppgaveTildeling } from '../../io/http'
import type { OppgaveId } from '../../oppgave/oppgaveTypes.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'

export interface DokumentIkkeTildeltProps {
  oppgaveId: OppgaveId
  journalpostId: string
  gåTilSak: boolean
}

export function DokumentIkkeTildelt({ oppgaveId, journalpostId, gåTilSak = false }: DokumentIkkeTildeltProps) {
  const saksbehandler = useInnloggetAnsatt()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const tildel = (event: MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postOppgaveTildeling({ oppgaveId, versjon: -1 })
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
