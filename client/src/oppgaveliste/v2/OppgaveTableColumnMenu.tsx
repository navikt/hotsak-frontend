import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

export interface OppgaveTableColumnMenuProps {
  columns: string[]
}

export function OppgaveTableColumnMenu(props: OppgaveTableColumnMenuProps) {
  const { columns } = props
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button size="xsmall" variant="tertiary-neutral" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
          Tilpass tabell
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Vis">
          {columns.map((column) => (
            <ActionMenu.CheckboxItem
              key={column}
              checked={false}
              onCheckedChange={(checked) => {
                console.log(column, checked)
              }}
            >
              {column}
            </ActionMenu.CheckboxItem>
          ))}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
