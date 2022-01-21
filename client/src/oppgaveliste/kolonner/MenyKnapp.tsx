import React, {useState} from 'react'
// @ts-ignore
import {Button, Loader} from '@navikt/ds-react'
import {CellContent} from '../../felleskomponenter/table/rader/CellContent'
import {deleteFjernTildeling} from '../../io/http'
import {EllipsisCircleH} from '@navikt/ds-icons'
import {useInnloggetSaksbehandler} from '../../state/authentication'
import {Dropdown} from '@navikt/ds-react-internal'
import {Oppgave, OppgaveStatusType} from '../../types/types.internal'
import {amplitude_taxonomy, logAmplitudeEvent} from '../../utils/amplitude'

interface MenyKnappProps {
  oppgave: Oppgave,
    onMutate: Function
}

export const MenyKnapp = ({ oppgave, onMutate }: MenyKnappProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)

  const menyClick = (event: React.MouseEvent) => {
    event.stopPropagation()
  }

  const disabled = () => {
    return !oppgave.saksbehandler || oppgave.saksbehandler.objectId !== saksbehandler.objectId || oppgave.status !== OppgaveStatusType.TILDELT_SAKSBEHANDLER
  }

  const fjernTildeling = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    deleteFjernTildeling(oppgave.saksid)
      .catch(() => setIsFetching(false))
      .then(() => {
        logAmplitudeEvent(amplitude_taxonomy.SAK_FRIGITT)
        setIsFetching(false)
        onMutate()
      })
  }

  return (
    <CellContent width={128}>
      {
        <Dropdown>
          <Button variant='tertiary' size='small' as={Dropdown.Toggle} onClick={menyClick} disabled={disabled()}>
            <EllipsisCircleH />
          </Button>
          <Dropdown.Menu onClick={menyClick}>
            <Dropdown.Menu.List>
              <Dropdown.Menu.List.Item
                disabled={disabled()}
                onClick={fjernTildeling}>Fjern tildeling {isFetching &&
              <Loader size='small' />}
              </Dropdown.Menu.List.Item>
            </Dropdown.Menu.List>
          </Dropdown.Menu>
        </Dropdown>
      }
    </CellContent>
  )
}
