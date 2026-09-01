import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'

import { OppgaveMenu } from '../oppgave/OppgaveMenu.tsx'
import { OppgaveMenuModals } from '../oppgave/OppgaveMenuModals.tsx'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser.ts'

export interface JournalføringMenuProps {
  oppgave: Journalføringsoppgave
  spørreundersøkelseId?: SpørreundersøkelseId
  onAction?(): unknown | Promise<unknown>
}

export function JournalføringMenu({ oppgave, spørreundersøkelseId, onAction }: JournalføringMenuProps) {
  return (
    <HStack justify="end">
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button variant="secondary" size="small" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
            Meny
          </Button>
        </ActionMenu.Trigger>

        <ActionMenu.Content>
          <OppgaveMenu oppgave={oppgave} onAction={onAction} />
        </ActionMenu.Content>
      </ActionMenu>
      <OppgaveMenuModals oppgave={oppgave} spørreundersøkelseId={spørreundersøkelseId} />
    </HStack>
  )
}
