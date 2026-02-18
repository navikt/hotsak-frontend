import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { type ReactNode } from 'react'

export interface OppgaveMenuProps {
  children: ReactNode
}

export function OppgaveMenu(props: OppgaveMenuProps) {
  const { children } = props
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          data-color="neutral"
          variant="tertiary"
          size="xsmall"
          type="button"
          icon={<MenuElipsisVerticalIcon title="Oppgavemeny" />}
          onClick={(event) => {
            event.stopPropagation()
          }}
        />
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group aria-label="Oppgavemeny">{children}</ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
