import React, { useState } from 'react'

import { MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { Button, Dropdown, Loader } from '@navikt/ds-react'

import { deleteFjernTildeling, postTildeling } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { useFortsettBehandling } from '../../hooks/useFortsettBehandling'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { OppgaveStatusType, Saksbehandler } from '../../types/types.internal'
import { useTildeling } from './useTildeling'

interface MenyKnappProps {
  sakID: string
  status: OppgaveStatusType
  tildeltSaksbehandler?: Saksbehandler
  kanTildeles: boolean
  knappeTekst?: string
  knappeIkon?: any
  onMutate: (...args: any[]) => any
}

export const MenyKnapp = ({
  sakID,
  status,
  tildeltSaksbehandler,
  kanTildeles,
  onMutate,
  knappeTekst,
  knappeIkon,
}: MenyKnappProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const { onTildel } = useTildeling({ sakId: sakID, gåTilSak: false })
  const { onFortsettBehandling, isFetching: endrerStatus } = useFortsettBehandling({ sakId: sakID, gåTilSak: false })
  const [isFetching, setIsFetching] = useState(false)

  const menyClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const kanOvertaSakStatuser = [OppgaveStatusType.TILDELT_SAKSBEHANDLER, OppgaveStatusType.AVVENTER_DOKUMENTASJON]

  const fjernTildelingDisabled =
    !tildeltSaksbehandler ||
    tildeltSaksbehandler.objectId !== saksbehandler.objectId ||
    status !== OppgaveStatusType.TILDELT_SAKSBEHANDLER

  const kanOvertaSak =
    tildeltSaksbehandler &&
    tildeltSaksbehandler.objectId !== saksbehandler.objectId &&
    kanOvertaSakStatuser.includes(status)

  const kanFortsetteBehandling =
    tildeltSaksbehandler &&
    tildeltSaksbehandler.objectId === saksbehandler.objectId &&
    status === OppgaveStatusType.AVVENTER_DOKUMENTASJON

  const overtaSak = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postTildeling(sakID)
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
    deleteFjernTildeling(sakID)
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
              icon={knappeIkon ? knappeIkon : <MenuElipsisHorizontalCircleIcon />}
            >
              {knappeTekst}
            </Button>
            <Dropdown.Menu onClick={menyClick}>
              <Dropdown.Menu.List>
                <Dropdown.Menu.List.Item disabled={fjernTildelingDisabled} onClick={fjernTildeling}>
                  Fjern tildeling {isFetching && <Loader size="xsmall" />}
                </Dropdown.Menu.List.Item>
                {kanOvertaSak && (
                  <Dropdown.Menu.List.Item onClick={overtaSak}>
                    Overta saken {isFetching && <Loader size="xsmall" />}
                  </Dropdown.Menu.List.Item>
                )}
                {kanTildeles && !kanOvertaSak && (
                  <Dropdown.Menu.List.Item onClick={onTildel}>
                    Ta saken {isFetching && <Loader size="xsmall" />}
                  </Dropdown.Menu.List.Item>
                )}
                {kanFortsetteBehandling && (
                  <Dropdown.Menu.List.Item onClick={onFortsettBehandling}>
                    Fortsett behandling {endrerStatus && <Loader size="xsmall" />}
                  </Dropdown.Menu.List.Item>
                )}
              </Dropdown.Menu.List>
            </Dropdown.Menu>
          </Dropdown>
        </span>
      }
    </>
  )
}
