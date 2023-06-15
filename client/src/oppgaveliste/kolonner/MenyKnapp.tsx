import { log } from 'console'
import React, { useState } from 'react'

import { MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { Button, Loader } from '@navikt/ds-react'
import { Dropdown } from '@navikt/ds-react-internal'

import { deleteFjernTildeling, postTildeling } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { useInnloggetSaksbehandler } from '../../state/authentication'
import { Oppgave, OppgaveStatusType } from '../../types/types.internal'

interface MenyKnappProps {
  oppgave: Oppgave
  onMutate: (...args: any[]) => any
}

export const MenyKnapp = ({ oppgave, onMutate }: MenyKnappProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)

  const menyClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const fjernTilDelingDisabled = () => {
    return (
      !oppgave.saksbehandler ||
      oppgave.saksbehandler.objectId !== saksbehandler.objectId ||
      oppgave.status !== OppgaveStatusType.TILDELT_SAKSBEHANDLER
    )
  }

  const overtaSakDisablet = () => {
    return (
      !oppgave.saksbehandler ||
      oppgave.saksbehandler.objectId === saksbehandler.objectId ||
      oppgave.status !== OppgaveStatusType.TILDELT_SAKSBEHANDLER
    )
  }

  const overtaSak = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postTildeling(oppgave.sakId)
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
    deleteFjernTildeling(oppgave.sakId)
      .catch(() => setIsFetching(false))
      .then(() => {
        logAmplitudeEvent(amplitude_taxonomy.SAK_FRIGITT)
        setIsFetching(false)
        onMutate()
      })
  }

  return (
    <>
      {
        <span style={{ display: 'flex', marginBlock: -2 }}>
          <Dropdown>
            <Button
              variant="tertiary"
              size="xsmall"
              as={Dropdown.Toggle}
              onClick={menyClick}
              disabled={fjernTilDelingDisabled() && overtaSakDisablet()}
              icon={<MenuElipsisHorizontalCircleIcon />}
            />
            <Dropdown.Menu onClick={menyClick}>
              <Dropdown.Menu.List>
                <Dropdown.Menu.List.Item value="asd" disabled={fjernTilDelingDisabled()} onClick={fjernTildeling}>
                  Fjern tildeling {isFetching && <Loader size="xsmall" />}
                </Dropdown.Menu.List.Item>
                <Dropdown.Menu.List.Item disabled={overtaSakDisablet()} onClick={overtaSak}>
                  Overta saken {isFetching && <Loader size="xsmall" />}
                </Dropdown.Menu.List.Item>
              </Dropdown.Menu.List>
            </Dropdown.Menu>
          </Dropdown>
        </span>
      }
    </>
  )
}
