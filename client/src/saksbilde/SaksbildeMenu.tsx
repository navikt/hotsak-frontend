import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useState } from 'react'

import { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser.ts'
import { OppgaveMenu } from '../oppgave/OppgaveMenu.tsx'
import { OverførOppgaveTilMedarbeiderModal } from '../oppgave/OverførOppgaveTilMedarbeiderModal.tsx'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { OverførSakTilGosysModal } from './OverførSakTilGosysModal.tsx'
import { useOverførSakTilGosys } from './useOverførSakTilGosys.ts'
import { EndreOppgaveModal } from '../oppgave/EndreOppgaveModal.tsx'

export interface SaksbildeMenuProps {
  spørreundersøkelseId: SpørreundersøkelseId
}

export function SaksbildeMenu({ spørreundersøkelseId }: SaksbildeMenuProps) {
  const { oppgave } = useOppgave()
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const [visOverførMedarbeider, setVisOverførMedarbeider] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys(spørreundersøkelseId)
  const [endreOppgave, setEndreOppgave] = useState(false);

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
                    visOverførGosys()
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
        enhet={oppgave.tildeltEnhet.enhetsnavn}
        open={visOverførMedarbeider}
        onClose={() => {
          setVisOverførMedarbeider(false)
        }}
      />
      <OverførSakTilGosysModal {...overførGosys} />
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
