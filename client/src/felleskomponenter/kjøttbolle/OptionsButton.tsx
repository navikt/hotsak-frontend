import React, { useRef, useState } from 'react'
import styled from 'styled-components/macro'

import { Popover } from '@navikt/ds-react'
import { Meatball } from '@navikt/helse-frontend-meatball'
import '@navikt/helse-frontend-meatball/lib/main.css'

//import { useInnloggetSaksbehandler } from '../../../../../state/authentication';
import { CellContent } from '../table/rader/CellContent'

import saksbehandler from '../../saksbehandler/innloggetSaksbehandler'
import { Oppgave } from '../../types/types.internal'
import { Tooltip } from '../Tooltip'
import { MeldAvMenuButton } from './MeldAvMenuButton'

const SpicyMeatball = styled(Meatball)`
  #circle_fill {
    fill: transparent;
  }

  :hover {
    #circle_fill {
      fill: var( --navds-semantic-color-interaction-primary-hover);
    }

    #inner_circle_left,
    #inner_circle_center,
    #inner_circle_right {
      fill: var(--navds-semantic-color-component-background-alternate);
    }
  }
`

const Container = styled.span`
  display: flex;
  align-items: center;
`

interface OptionsButtonProps {
  oppgave: Oppgave
}

export const OptionsButton = React.memo(({ oppgave }: OptionsButtonProps) => {
  const [popoverIsActive, setPopoverIsActive] = useState(false)
  const meatballRef = useRef<HTMLButtonElement>(null)

  const erTildeltInnloggetBruker = oppgave.saksbehandler?.objectId === saksbehandler.objectId
  const id = `options-${oppgave.saksid}`

  const togglePopover = (event: React.MouseEvent) => {
    event.stopPropagation()
    setPopoverIsActive((active) => !active)
  }

  const closePopover = () => {
    setPopoverIsActive(false)
  }

  return (
    <CellContent>
      <Container data-tip="Mer" data-for={id}>
        <SpicyMeatball
          // @ts-ignore
          ref={meatballRef}
          size="s"
          onClick={togglePopover}
        />
        <Popover
          anchorEl={meatballRef.current}
          open={popoverIsActive}
          onClose={closePopover}
          placement="bottom"
          arrow={false}
          offset={0}
        >
          {erTildeltInnloggetBruker && (
            <>
              <MeldAvMenuButton oppgavereferanse={oppgave.saksid} />
            </>
          )}
        </Popover>
      </Container>
      <Tooltip id={id} effect="solid" offset={{ top: -10 }} />
    </CellContent>
  )
})
