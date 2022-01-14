import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'
// @ts-ignore
import { useSWRConfig } from 'swr'
import {Button, Loader} from '@navikt/ds-react'
//import { useTildelOppgave } from '../../../../state/oppgaver';
import { CellContent } from '../../felleskomponenter/table/rader/CellContent'
import { postTildeling } from '../../io/http'

import { useInnloggetSaksbehandler } from '../../state/authentication'

const Tildelingsknapp = styled(Button)`
  min-height: 0;
  height: var(--navds-spacing-6);
  padding: 0 var(--navds-spacing-3);
  box-sizing: border-box;
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
        <Tildelingsknapp size="small" variant={gåTilSak ? "tertiary" : "secondary"  } onClick={tildel} data-cy={`btn-tildel-sak-${oppgavereferanse}`}>
          Start saken
          {isFetching && <Loader size="small" />}
        </Tildelingsknapp>
      }
    </CellContent>
  )
}
