import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useState } from 'react'

import { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser.ts'
import { EndreOppgaveModal } from '../oppgave/EndreOppgaveModal.tsx'
import { OppgaveMenu } from '../oppgave/OppgaveMenu.tsx'
import { OverførOppgaveTilMedarbeiderModal } from '../oppgave/OverførOppgaveTilMedarbeiderModal.tsx'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { GjenståendeOverfør } from '../sak/v2/behandling/behandlingTyper.ts'
import { OverførtilGosysValideringFeil } from '../sak/v2/modaler/OverførtilGosysValideringFeil.tsx'
import { OverførSakTilGosysModal } from './OverførSakTilGosysModal.tsx'
import { useOverførSakTilGosys } from './useOverførSakTilGosys.ts'

export interface SaksbildeMenuProps {
  gjenståendeFørOverføring?: GjenståendeOverfør[]
  spørreundersøkelseId: SpørreundersøkelseId
}

export function SaksbildeMenu({ spørreundersøkelseId, gjenståendeFørOverføring = [] }: SaksbildeMenuProps) {
  const { oppgave } = useOppgave()
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const [visOverførMedarbeider, setVisOverførMedarbeider] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys(spørreundersøkelseId)
  const [endreOppgave, setEndreOppgave] = useState(false)
  const [visValideringsFeil, setVisValideringsFeil] = useState(false)

  if (!oppgave || oppgaveErAvsluttet) {
    return null
  }

  console.log('Saksbildemeny', gjenståendeFørOverføring)

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
          <OppgaveMenu
            oppgave={oppgave}
            onSelectOverførOppgaveTilMedarbeider={() => {
              setVisOverførMedarbeider(true)
            }}
            onSelectEndreOppgave={() => {
              setEndreOppgave(true)
            }}
          />
          {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
            <>
              <ActionMenu.Divider />
              <ActionMenu.Group aria-label="Saksmeny">
                <ActionMenu.Item
                  onSelect={() => {
                    if (gjenståendeFørOverføring.length > 0) {
                      setVisValideringsFeil(true)
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
      <OverførOppgaveTilMedarbeiderModal
        sakId={oppgave.sakId?.toString() ?? ''}
        open={visOverførMedarbeider}
        onClose={() => {
          setVisOverførMedarbeider(false)
        }}
      />
      <OverførSakTilGosysModal {...overførGosys} />
      <OverførtilGosysValideringFeil
        gjenstående={gjenståendeFørOverføring}
        open={visValideringsFeil}
        onClose={() => setVisValideringsFeil(false)}
      />
      <EndreOppgaveModal
        oppgave={oppgave}
        open={endreOppgave}
        onClose={() => {
          setEndreOppgave(false)
        }}
      />
    </>
  )
}
