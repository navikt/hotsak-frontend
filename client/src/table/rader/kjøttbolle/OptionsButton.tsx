import styled from '@emotion/styled'
import React, { useRef, useState } from 'react'

import { Popover } from '@navikt/ds-react'

import { Oppgave } from '../../../types/types.internal'
//import { Meatball } from '@navikt/helse-frontend-meatball';
//import '@navikt/helse-frontend-meatball/lib/main.css';
//import { Tooltip } from '../../../../../components/Tooltip';
//import { useInnloggetSaksbehandler } from '../../../../../state/authentication';
import { CellContent } from '../CellContent'

//import { FjernFraPåVentMenuButton } from './FjernFraPåVentMenuButton';
//import { LeggPåVentMenuButton } from './LeggPåVentMenuButton';
//import { MeldAvMenuButton } from './MeldAvMenuButton';
//import { TildelMenuButton } from './TildelMenuButton';

/*const SpicyMeatball = styled(Meatball)`
    #circle_fill {
        fill: transparent;
    }

    :hover {
        #circle_fill {
            fill: var(--navds-color-action-hover);
        }

        #inner_circle_left,
        #inner_circle_center,
        #inner_circle_right {
            fill: var(--navds-color-text-inverse);
        }
    }
`;*/

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

  // const innloggetSaksbehandler = useInnloggetSaksbehandler();
  // const erTildeltInnloggetBruker = oppgave.tildeling?.saksbehandler?.oid === innloggetSaksbehandler.oid;

  var erTildeltInnloggetBruker = true
  const innloggetSaksbehandler = { iod: '1234', epost: 'banan@fjes.com', navn: 'Bjarne Betjent' }

  // const id = `options-${oppgave.oppgavereferanse}`;
  const id = '1234'

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
        Kjøttbolle
      </Container>
      {/*<SpicyMeatball
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
                    {!erTildeltInnloggetBruker && (
                        "TilDelMenuButton"
                        <TildelMenuButton
                            oppgavereferanse={oppgave.oppgavereferanse}
                            saksbehandler={innloggetSaksbehandler}
                            tildeling={oppgave.tildeling}
                        />
                    )
                    {erTildeltInnloggetBruker && oppgave.tildeling && (
                        <>
                       
                            {<MeldAvMenuButton oppgavereferanse={oppgave.oppgavereferanse} />
                            {"MeldAvMenuButton"}
                            {/*oppgave.tildeling.påVent true ? ( ("FjernFraPåVentMenuButton")
                               /*<FjernFraPåVentMenuButton oppgavereferanse={oppgave.oppgavereferanse} />
                            ) : ("LeggPåVentKnapp")
                                
                                
                            }
                            {/*<LeggPåVentMenuButton oppgavereferanse={oppgave.oppgavereferanse} />}
                        </>
                        
                    )
                </Popover>}
            </Container>
            {/*<Tooltip id={id} effect="solid" offset={{ top: -10 }} />*/}
    </CellContent>
  )
})
