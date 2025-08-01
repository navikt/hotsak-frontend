import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Button, Dropdown, Loader } from '@navikt/ds-react'
import { MouseEvent, useState } from 'react'
import styled from 'styled-components'

import { deleteFjernOppgaveTildeling, postOppgaveTildeling } from '../io/http.ts'
import { OppgaveId, Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { Saksbehandler } from '../types/types.internal.ts'

export interface ManuellJournalføringKnappProps {
  oppgaveId: OppgaveId
  status: Oppgavestatus
  tildeltSaksbehandler?: Saksbehandler

  onMutate(...args: any[]): any
}

export function JournalføringKnapp({
  oppgaveId,
  status,
  tildeltSaksbehandler,
  onMutate,
}: ManuellJournalføringKnappProps) {
  const saksbehandler = useInnloggetAnsatt()
  const [isFetching, setIsFetching] = useState(false)

  const menyClick = (event: MouseEvent) => {
    event.stopPropagation()
  }

  const kanOvertaOppgaveStatuser = [Oppgavestatus.UNDER_BEHANDLING]

  const kanFjerneTildeling =
    tildeltSaksbehandler && tildeltSaksbehandler.id === saksbehandler.id && status === Oppgavestatus.UNDER_BEHANDLING

  const kanOvertaOppgave =
    tildeltSaksbehandler && tildeltSaksbehandler.id !== saksbehandler.id && kanOvertaOppgaveStatuser.includes(status)

  const overtaSak = (event: MouseEvent) => {
    event.stopPropagation()

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    postOppgaveTildeling({ oppgaveId, versjon: -1 })
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
    deleteFjernOppgaveTildeling({ oppgaveId, versjon: -1 })
      .catch(() => setIsFetching(false))
      .then(() => {
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
