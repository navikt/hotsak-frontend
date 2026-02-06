import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CogIcon, DragVerticalIcon, TrashIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'
import { useMemo } from 'react'

import { getOppgaveColumn, type OppgaveColumnState } from './oppgaveColumns.tsx'
import {
  useOppgaveColumnChange,
  useOppgaveColumnDragged,
  useOppgaveColumnsContext,
  useOppgaveColumnsReset,
} from './OppgaveColumnsContext.ts'

export function OppgaveColumnMenu() {
  const columnsState = useOppgaveColumnsContext()
  const handleReset = useOppgaveColumnsReset()
  const resetEnabled = useMemo(() => !columnsState.every((columnState) => columnState.checked), [columnsState])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useOppgaveColumnDragged()

  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button variant="tertiary-neutral" icon={<CogIcon />} size="xsmall">
          Tilpass tabell
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Velg kolonner">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
          >
            <div>
              <SortableContext items={columnsState as any} strategy={verticalListSortingStrategy}>
                {columnsState.map((columnState) => (
                  <OppgaveColumnMenuItem key={columnState.id} columnState={columnState} />
                ))}
              </SortableContext>
            </div>
          </DndContext>
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

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: columnState.id })

  if (!header) {
    return null
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ActionMenu.CheckboxItem checked={columnState.checked} onCheckedChange={handleChange}>
        <HStack gap="3" align="center" justify="space-between" width="100%" wrap={false}>
          <div style={{ whiteSpace: 'nowrap' }}>{header}</div>
          <div {...attributes} {...listeners}>
            <DragVerticalIcon />
          </div>
        </HStack>
      </ActionMenu.CheckboxItem>
    </div>
  )
}
