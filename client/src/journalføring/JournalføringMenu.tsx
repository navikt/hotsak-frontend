import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'

import { OppgaveMenu } from '../oppgave/OppgaveMenu.tsx'
import { OppgaveMenuModals } from '../oppgave/OppgaveMenuModals.tsx'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'

export interface JournalføringMenuProps {
  oppgave: Journalføringsoppgave
  onAction?(): unknown | Promise<unknown>
}

export function JournalføringMenu({ oppgave, onAction }: JournalføringMenuProps) {
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  if (!(oppgave && oppgaveErUnderBehandlingAvInnloggetAnsatt)) {
    return null
  }

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
      <OppgaveMenuModals oppgave={oppgave} />
    </HStack>
  )
}
