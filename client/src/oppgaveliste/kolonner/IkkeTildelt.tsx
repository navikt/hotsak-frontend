import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
// @ts-ignore
import { useSWRConfig } from 'swr'
import {Button} from '@navikt/ds-react'
//import { useTildelOppgave } from '../../../../state/oppgaver';
import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { postTildeling } from '../../io/http'

import { useInnloggetSaksbehandler } from '../../state/authentication'

const Tildelingsknapp = styled(Button)`
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
        <Tildelingsknapp size="small" variant="secondary" onClick={tildel} spinner={isFetching} data-cy={`btn-tildel-sak-${oppgavereferanse}`}>
          Start saken
        </Tildelingsknapp>
      }
    </CellContent>
  )
}
