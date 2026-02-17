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
import { ActionMenu, Button, HStack, VStack } from '@navikt/ds-react'

import classes from './OppgaveColumnMenu.module.css'

import { getOppgaveColumn } from './oppgaveColumns.tsx'
import {
  type OppgaveColumnState,
  useIsTableCustomized,
  useOppgaveColumnsContext,
  useOppgaveColumnsMoveColumnHandler,
  useOppgaveColumnsResetAllHandler,
  useOppgaveColumnToggleColumnHandler,
} from './OppgaveColumnsContext.ts'

export function OppgaveColumnMenu() {
  const columnsState = useOppgaveColumnsContext()
  const isTableCustomized = useIsTableCustomized()
  const handleResetAll = useOppgaveColumnsResetAllHandler()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleMoveColumn = useOppgaveColumnsMoveColumnHandler()

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
            onDragEnd={handleMoveColumn}
          >
            <div>
              <SortableContext items={columnsState as any} strategy={verticalListSortingStrategy}>
                {columnsState.map((columnState) => (
                  <OppgaveColumnMenuItem key={columnState.id} columnState={columnState} />
                ))}
              </SortableContext>
            </div>
          </DndContext>
          {isTableCustomized && (
            <ActionMenu.Item variant="danger" icon={<TrashIcon />} onSelect={handleResetAll}>
              Tilbakestill tabell
            </ActionMenu.Item>
          )}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function OppgaveColumnMenuItem({ columnState }: { columnState: OppgaveColumnState }) {
  const handleToggleColumn = useOppgaveColumnToggleColumnHandler(columnState.id)
  const header = getOppgaveColumn(columnState.id).header

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: columnState.id })

  if (!header) {
    return null
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <ActionMenu.CheckboxItem checked={columnState.checked} onCheckedChange={handleToggleColumn}>
        <HStack gap="3" align="center" justify="space-between" width="100%" wrap={false}>
          <div className={classes.draggableHeader}>{header}</div>
          <VStack className={isDragging ? classes.isDragging : classes.isNotDragging} {...attributes} {...listeners}>
            <DragVerticalIcon width={20} height={20} />
          </VStack>
        </HStack>
      </ActionMenu.CheckboxItem>
    </div>
  )
}
