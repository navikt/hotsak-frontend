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
        <Button variant="tertiary-neutral" icon={<CogIcon aria-label="TODO" />} size="xsmall" />
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Kolonner">
          {columns.map((column) => (
            <OppgaveColumnMenuItem key={column.key} column={column} />
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
        key: column.key,
      })
    },
    [column.key, dispatch]
  )
  return (
    <ActionMenu.CheckboxItem checked={column.checked} onCheckedChange={handleCheckedChange}>
      <HStack gap="3" align="center" justify="space-between" width="100%">
        <div>{headerForColumn(column.key)}</div>
        <DragVerticalIcon />
      </HStack>
    </ActionMenu.CheckboxItem>
  )
}
