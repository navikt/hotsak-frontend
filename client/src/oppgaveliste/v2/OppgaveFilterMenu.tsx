import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

import { type OppgaveFilter } from './OppgaveFilterContext.tsx'

export interface OppgaveFilterMenuProps {
  filters: OppgaveFilter[]
}

export function OppgaveFilterMenu(props: OppgaveFilterMenuProps) {
  const { filters } = props
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button size="xsmall" variant="tertiary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
          Velg filter
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Vis filter for">
          {filters.map((filter) => (
            <ActionMenu.CheckboxItem key={filter.key} checked={filter.enabled} onCheckedChange={filter.setEnabled}>
              {filter.displayName}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
