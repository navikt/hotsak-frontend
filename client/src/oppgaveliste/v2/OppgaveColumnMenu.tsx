import { CogIcon, DragVerticalIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'
import { useCallback } from 'react'

import { getOppgaveColumn, type OppgaveColumnState } from './oppgaveColumns.tsx'
import { useOppgaveColumnsContext, useOppgaveColumnsDispatchContext } from './OppgaveColumnsContext.ts'

export function OppgaveColumnMenu() {
  const columnStates = useOppgaveColumnsContext()
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button variant="tertiary-neutral" icon={<CogIcon aria-label="Tilpass tabell" />} size="xsmall">
          Tilpass tabell
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Kolonner">
          {columnStates.map((columnState) => (
            <OppgaveColumnMenuItem key={columnState.field} columnState={columnState} />
          ))}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function OppgaveColumnMenuItem({ columnState }: { columnState: OppgaveColumnState }) {
  const dispatch = useOppgaveColumnsDispatchContext()
  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      dispatch({
        type: checked ? 'checked' : 'unchecked',
        field: columnState.field,
      })
    },
    [columnState.field, dispatch]
  )
  const header = getOppgaveColumn(columnState.field).header
  if (!header) {
    return null
  }
  return (
    <ActionMenu.CheckboxItem checked={columnState.checked} onCheckedChange={handleCheckedChange}>
      <HStack gap="3" align="center" justify="space-between" width="100%">
        <div>{header}</div>
        <DragVerticalIcon />
      </HStack>
    </ActionMenu.CheckboxItem>
  )
}
