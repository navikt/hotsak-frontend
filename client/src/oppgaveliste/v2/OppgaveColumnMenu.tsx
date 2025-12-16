import { CogIcon, DragVerticalIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'
import { useCallback } from 'react'

import { headerForColumn, type OppgaveColumn } from './oppgaveColumns.tsx'
import { useOppgaveColumnsContext, useOppgaveColumnsDispatchContext } from './OppgaveColumnsContext.ts'

export function OppgaveColumnMenu() {
  const columns = useOppgaveColumnsContext()
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button variant="tertiary-neutral" icon={<CogIcon aria-label="Tilpass tabell" />} size="xsmall">
          Tilpass tabell
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Kolonner">
          {columns.map((column) => (
            <OppgaveColumnMenuItem key={column.field} column={column} />
          ))}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function OppgaveColumnMenuItem({ column }: { column: OppgaveColumn }) {
  const dispatch = useOppgaveColumnsDispatchContext()
  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      dispatch({
        type: checked ? 'checked' : 'unchecked',
        field: column.field,
      })
    },
    [column.field, dispatch]
  )
  return (
    <ActionMenu.CheckboxItem checked={column.checked} onCheckedChange={handleCheckedChange}>
      <HStack gap="3" align="center" justify="space-between" width="100%">
        <div>{headerForColumn(column.field)}</div>
        <DragVerticalIcon />
      </HStack>
    </ActionMenu.CheckboxItem>
  )
}
