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

export interface SaksbildeMenuProps {
  spørreundersøkelseId: SpørreundersøkelseId
}

export function SaksbildeMenu({ spørreundersøkelseId }: SaksbildeMenuProps) {
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const [visOverførMedarbeider, setVisOverførMedarbeider] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys(spørreundersøkelseId)

  if (!oppgave) {
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
          />
          <ActionMenu.Divider />
          <ActionMenu.Group label="Sak">
            {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
              <ActionMenu.Item
                onSelect={() => {
                  visOverførGosys()
                }}
              >
                Overfør sak til Gosys
              </ActionMenu.Item>
            )}
          </ActionMenu.Group>
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
    </>
  )
}
