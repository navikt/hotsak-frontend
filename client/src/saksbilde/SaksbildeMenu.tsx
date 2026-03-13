import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useState } from 'react'

import { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser.ts'
import { OppgaveMenu } from '../oppgave/OppgaveMenu.tsx'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { GjenståendeOverfør } from '../sak/v2/behandling/behandlingTyper.ts'
import { OverførtilGosysValideringFeil } from '../sak/v2/modaler/OverførtilGosysValideringFeil.tsx'
import { OverførSakTilGosysModal } from './OverførSakTilGosysModal.tsx'
import { useOverførSakTilGosys } from './useOverførSakTilGosys.ts'
import { OppgaveMenuModals } from '../oppgave/OppgaveMenuModals.tsx'

export interface SaksbildeMenuProps {
  gjenståendeFørOverføring?: GjenståendeOverfør[]
  spørreundersøkelseId: SpørreundersøkelseId
}

export function SaksbildeMenu({ spørreundersøkelseId, gjenståendeFørOverføring = [] }: SaksbildeMenuProps) {
  const { oppgave } = useOppgave()
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys(spørreundersøkelseId)
  const [visValideringsfeil, setVisValideringsfeil] = useState(false)

  if (!oppgave || oppgaveErAvsluttet) {
    return null
  }

  return (
    <>
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
          <OppgaveMenu oppgave={oppgave} />
          {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
            <>
              <ActionMenu.Divider />
              <ActionMenu.Group aria-label="Saksmeny">
                <ActionMenu.Item
                  onSelect={() => {
                    if (gjenståendeFørOverføring.length > 0) {
                      setVisValideringsfeil(true)
                    } else {
                      visOverførGosys()
                    }
                  }}
                >
                  Overfør sak til Gosys
                </ActionMenu.Item>
              </ActionMenu.Group>
            </>
          )}
        </ActionMenu.Content>
      </ActionMenu>
      <OppgaveMenuModals oppgave={oppgave} />
      <OverførSakTilGosysModal {...overførGosys} />
      <OverførtilGosysValideringFeil
        gjenstående={gjenståendeFørOverføring}
        open={visValideringsfeil}
        onClose={() => setVisValideringsfeil(false)}
      />
    </>
  )
}
