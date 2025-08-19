import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'

import { OppgaveMenu } from '../oppgave/OppgaveMenu.tsx'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'

export interface JournalføringMenuProps {
  onAction(...args: any[]): any
}

export function JournalføringMenu({ onAction }: JournalføringMenuProps) {
  const { oppgave } = useOppgave()

  const { oppgaveErAvsluttet } = useOppgaveregler(oppgave)
  if (oppgaveErAvsluttet) {
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
    </HStack>
  )
}
