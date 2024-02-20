import React, { useState } from 'react'

import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Button, Dropdown, Loader } from '@navikt/ds-react'

import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import styled from 'styled-components'
import { deleteFjernOppgaveTildeling, postOppgaveTildeling } from '../../io/http'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { Oppgavestatus, Saksbehandler } from '../../types/types.internal'

interface OppgaveMenyKnappProps {
  oppgaveId: string
  status: Oppgavestatus
  tildeltSaksbehandler?: Saksbehandler
  onMutate: (...args: any[]) => any
}

export const OppgaveMenyKnapp = ({ oppgaveId, status, tildeltSaksbehandler, onMutate }: OppgaveMenyKnappProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)

  const menyClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const kanOvertaOppgaveStatuser = [Oppgavestatus.UNDER_BEHANDLING]

  const kanFjerneTildeling =
    (tildeltSaksbehandler && tildeltSaksbehandler.id === saksbehandler.id) || status === Oppgavestatus.UNDER_BEHANDLING

  const kanOvertaOppgave =
    tildeltSaksbehandler && tildeltSaksbehandler.id !== saksbehandler.id && kanOvertaOppgaveStatuser.includes(status)

  const overtaSak = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postOppgaveTildeling(oppgaveId)
      .catch(() => setIsFetching(false))
      .then(() => {
        logAmplitudeEvent(amplitude_taxonomy.SAK_OVERTATT)
        setIsFetching(false)
        onMutate()
      })
  }

  const fjernTildeling = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    deleteFjernOppgaveTildeling(oppgaveId)
      .catch(() => setIsFetching(false))
      .then(() => {
        logAmplitudeEvent(amplitude_taxonomy.SAK_FRIGITT)
        setIsFetching(false)
        onMutate()
      })
  }

  return (
    <MenyContainer>
      <Dropdown>
        <Button
          variant="secondary"
          size="small"
          as={Dropdown.Toggle}
          title="saksmeny"
          onClick={menyClick}
          icon={<ChevronDownIcon />}
        >
          Meny
        </Button>
        <Dropdown.Menu onClick={menyClick}>
          <Dropdown.Menu.List>
            {
              <Dropdown.Menu.List.Item disabled={!kanFjerneTildeling} onClick={fjernTildeling}>
                Fjern tildeling {isFetching && <Loader size="xsmall" />}
              </Dropdown.Menu.List.Item>
            }
            {kanOvertaOppgave && (
              <Dropdown.Menu.List.Item onClick={overtaSak}>
                Overta oppgave{isFetching && <Loader size="xsmall" />}
              </Dropdown.Menu.List.Item>
            )}
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>
    </MenyContainer>
  )
}

const MenyContainer = styled.div`
  text-align: right;
`
