import { CogIcon, DragVerticalIcon, TrashIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'

import { getOppgaveColumn, type OppgaveColumnState } from './oppgaveColumns.tsx'
import { useOppgaveColumnChange, useOppgaveColumnsContext, useOppgaveColumnsReset } from './OppgaveColumnsContext.ts'
import { useMemo } from 'react'

export function OppgaveColumnMenu() {
  const columnsState = useOppgaveColumnsContext()
  const handleReset = useOppgaveColumnsReset()
  const resetEnabled = useMemo(() => !columnsState.every((columnState) => columnState.checked), [columnsState])
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button variant="tertiary-neutral" icon={<CogIcon aria-label="Tilpass tabell" />} size="xsmall">
          Tilpass tabell
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Kolonner">
          {columnsState.map((columnState) => (
            <OppgaveColumnMenuItem key={columnState.field} columnState={columnState} />
          ))}
          {resetEnabled && (
            <ActionMenu.Item variant="danger" icon={<TrashIcon />} onSelect={handleReset}>
              Nullstill tabell
            </ActionMenu.Item>
          )}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function OppgaveColumnMenuItem({ columnState }: { columnState: OppgaveColumnState }) {
  const handleChange = useOppgaveColumnChange(columnState.field)
  const header = getOppgaveColumn(columnState.field).header
  if (!header) {
    return null
  }
  return (
    <ActionMenu.CheckboxItem checked={columnState.checked} onCheckedChange={handleChange}>
      <HStack gap="3" align="center" justify="space-between" width="100%">
        <div>{header}</div>
        <DragVerticalIcon />
      </HStack>
    </ActionMenu.CheckboxItem>
  )
}
