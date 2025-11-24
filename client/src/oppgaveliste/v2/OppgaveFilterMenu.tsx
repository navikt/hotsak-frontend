import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

export interface OppgaveFilterMenuProps {
  filters: string[]
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
            <ActionMenu.CheckboxItem
              key={filter}
              checked={false}
              onCheckedChange={(checked) => {
                console.log(filter, checked)
              }}
            >
              {filter}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
