import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

// import { useFortsettBehandling } from '../../hooks/useFortsettBehandling'
import { Oppgavemeny } from '../../oppgave/Oppgavemeny.tsx'
import { Saksmeny } from '../../sak/Saksmeny.tsx'
// import { useOverførGosys } from '../../saksbilde/useOverførGosys'
import { OppgaveStatusType, Saksbehandler, Sakstype } from '../../types/types.internal'

// import { useTildeling } from './useTildeling'

interface MenyKnappProps {
  sakId: string
  status: OppgaveStatusType
  tildeltSaksbehandler?: Saksbehandler
  sakstype?: Sakstype
  kanTildeles: boolean
  setKonfliktModalOpen?(val: string | undefined): void
  onMutate(...args: any[]): any
}

export function MenyKnapp({ onMutate }: MenyKnappProps) {
  // const saksbehandler = useInnloggetAnsatt()
  /*
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
  */
  // const { onFortsettBehandling, isFetching: endrerStatus } = useFortsettBehandling({ sakId: sakId, gåTilSak: false })
  // const [isFetching, setIsFetching] = useState(false)
  // const { onOpen: visOverførGosys } = useOverførGosys(sakId, 'barnebrillesak_overført_gosys_v1')
  // const { endreOppgavetildeling, fjernOppgavetildeling } = useOppgaveActions()

  /*
  const menyClick = (event: MouseEvent) => {
    event.stopPropagation()
  }
  */

  // const kanOvertaSakStatuser = [OppgaveStatusType.TILDELT_SAKSBEHANDLER, OppgaveStatusType.AVVENTER_DOKUMENTASJON]

  /*
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
  */

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant="tertiary"
          size="xsmall"
          icon={<ChevronDownIcon title="Saksmeny" />}
          iconPosition="right"
          onClick={(event) => {
            event.stopPropagation()
          }}
        >
          Meny
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <Oppgavemeny onAction={onMutate} />
        <ActionMenu.Divider />
        <Saksmeny />
      </ActionMenu.Content>
    </ActionMenu>
  )

  /*
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
  */
}
