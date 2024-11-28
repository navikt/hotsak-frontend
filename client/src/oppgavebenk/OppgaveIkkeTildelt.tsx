import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@navikt/ds-react'

import { postOppgaveTildeling } from '../io/http'
import { useInnloggetSaksbehandler } from '../state/authentication'
import { OppgaveApiOppgave } from '../types/experimentalTypes'
import { Oppgavetype } from '../types/types.internal'

interface OppgaveIkkeTildeltProps {
  oppgave: OppgaveApiOppgave
}

export const OppgaveIkkeTildelt = ({ oppgave }: OppgaveIkkeTildeltProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const { oppgaveId, oppgavetype, sakId, journalpostId, versjon } = oppgave

  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const tildel = (event: MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return

    setIsFetching(true)
    postOppgaveTildeling(oppgaveId, versjon)
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        const destinationUrl =
          oppgavetype === Oppgavetype.JOURNALFØRING
            ? `/oppgaveliste/dokumenter/${journalpostId}`
            : `/sak/${sakId}/hjelpemidler`
        navigate(destinationUrl)
      })
  }

  return (
    <>
      {
        <Button
          size="xsmall"
          variant="tertiary"
          onClick={tildel}
          name="Ta oppgave"
          disabled={isFetching}
          loading={isFetching}
        >
          Ta oppgave
        </Button>
      }
    </>
  )
}
