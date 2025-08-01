import { MouseEvent, useState } from 'react'
import { MenuElipsisHorizontalCircleIcon } from '@navikt/aksel-icons'
import { Button, Dropdown, Loader } from '@navikt/ds-react'

import { useFortsettBehandling } from '../../hooks/useFortsettBehandling'
import { OppgaveStatusType, Saksbehandler, Sakstype } from '../../types/types.internal'
import { useTildeling } from './useTildeling'
import { useOverførGosys } from '../../saksbilde/useOverførGosys'
import { OverførGosysModal } from '../../saksbilde/OverførGosysModal'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'

interface MenyKnappProps {
  sakId: string
  status: OppgaveStatusType
  tildeltSaksbehandler?: Saksbehandler
  sakstype?: Sakstype
  kanTildeles: boolean
  gåTilSak?: boolean
  knappeTekst?: string
  knappeIkon?: any
  setKonfliktModalOpen?(val: string | undefined): void
  onMutate(...args: any[]): any
}

export function MenyKnapp({
  sakId,
  status,
  tildeltSaksbehandler,
  kanTildeles,
  sakstype,
  gåTilSak = false,
  setKonfliktModalOpen,
  onMutate,
  knappeTekst,
  knappeIkon,
}: MenyKnappProps) {
  const saksbehandler = useInnloggetAnsatt()
  const { onTildel } = useTildeling({
    sakId: sakId,
    gåTilSak: gåTilSak,
    sakstype: sakstype,
    onTildelingKonflikt: () => {
      if (setKonfliktModalOpen)
        setKonfliktModalOpen(sakstype !== Sakstype.TILSKUDD ? `/sak/${sakId}/hjelpemidler` : `/sak/${sakId}`)
      onMutate()
    },
  })
  const { onFortsettBehandling, isFetching: endrerStatus } = useFortsettBehandling({ sakId: sakId, gåTilSak: false })
  const [isFetching, setIsFetching] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførGosys(sakId, 'barnebrillesak_overført_gosys_v1')
  const { endreOppgavetildeling, fjernOppgavetildeling } = useOppgaveActions()

  const menyClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const kanOvertaSakStatuser = [OppgaveStatusType.TILDELT_SAKSBEHANDLER, OppgaveStatusType.AVVENTER_DOKUMENTASJON]

  const fjernTildelingDisabled =
    !tildeltSaksbehandler ||
    tildeltSaksbehandler.id !== saksbehandler.id ||
    status !== OppgaveStatusType.TILDELT_SAKSBEHANDLER

  const kanOvertaSak =
    tildeltSaksbehandler && tildeltSaksbehandler.id !== saksbehandler.id && kanOvertaSakStatuser.includes(status)

  const kanFortsetteBehandling =
    tildeltSaksbehandler &&
    tildeltSaksbehandler.id === saksbehandler.id &&
    status === OppgaveStatusType.AVVENTER_DOKUMENTASJON

  const kanOverføreTilGosys =
    tildeltSaksbehandler &&
    tildeltSaksbehandler.id === saksbehandler.id &&
    status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  const overtaSak = (event: MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    endreOppgavetildeling({ overtaHvisTildelt: true })
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        onMutate()
      })
  }

  const fjernTildeling = (event: MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    fjernOppgavetildeling()
      .catch(() => setIsFetching(false))
      .then(() => {
        setIsFetching(false)
        onMutate()
      })
  }

  return (
    <>
      <div style={{ display: 'flex', marginBlock: -2 }}>
        <Dropdown>
          <Button
            variant="tertiary"
            size="xsmall"
            as={Dropdown.Toggle}
            title="saksmeny"
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
              {kanOverføreTilGosys && (
                <Dropdown.Menu.List.Item onClick={visOverførGosys}>
                  Overfør til Gosys {endrerStatus && <Loader size="xsmall" />}
                </Dropdown.Menu.List.Item>
              )}
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <OverførGosysModal {...overførGosys} />
    </>
  )
}
