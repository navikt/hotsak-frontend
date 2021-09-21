import styled from 'styled-components/macro'
import React, { useState } from 'react'

import { Knapp } from 'nav-frontend-knapper'

import { useHistory } from 'react-router-dom'
import { useInnloggetSaksbehandler } from '../../state/authentication'
//import { useTildelOppgave } from '../../../../state/oppgaver';
import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { postTildeling } from '../../io/http'
// @ts-ignore
import { useSWRConfig } from 'swr'

const Tildelingsknapp = styled(Knapp)`
  min-height: 0;
  height: 1.5rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
  font-size: var(--navds-font-size-xs);
`

interface IkkeTildeltProps {
  oppgavereferanse: string
  gåTilSak: boolean
}

export const IkkeTildelt = ({ oppgavereferanse, gåTilSak = false }: IkkeTildeltProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const history = useHistory()
  const { mutate } = useSWRConfig()
  //const tildelOppgave = useTildelOppgave();

  const tildel = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postTildeling(oppgavereferanse)
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        if (gåTilSak) {
          const destinationUrl = `/sak/${oppgavereferanse}/hjelpemidler`
          history.push(destinationUrl)
        } else {
          mutate(`api/sak/${oppgavereferanse}`)
          mutate(`api/sak/${oppgavereferanse}/historikk`)
        }
      })
  }

  return (
    <CellContent width={128}>
      {
        <Tildelingsknapp mini onClick={tildel} spinner={isFetching}>
          Start saken
        </Tildelingsknapp>
      }
    </CellContent>
  )
}
