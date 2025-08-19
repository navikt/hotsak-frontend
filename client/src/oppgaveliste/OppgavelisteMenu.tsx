import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

import { OppgaveMenu } from '../oppgave/OppgaveMenu.tsx'
import { OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'

export interface OppgavelisteMenuProps {
  oppgave: OppgaveV2
}

export function OppgavelisteMenu(props: OppgavelisteMenuProps) {
  const { oppgave } = props

  const { oppgaveErAvsluttet } = useOppgaveregler(oppgave)
  if (oppgaveErAvsluttet) {
    return null
  }

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant="tertiary-neutral"
          size="xsmall"
          icon={<MenuElipsisVerticalIcon title="Oppgavemeny" />}
          onClick={(event) => {
            event.stopPropagation()
          }}
        />
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <OppgaveMenu oppgave={oppgave} />
      </ActionMenu.Content>
    </ActionMenu>
  )
}
