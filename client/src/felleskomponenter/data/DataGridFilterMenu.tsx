import { FunnelFillIcon, FunnelIcon, TrashIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

import { useDataGridFilterContext, useDataGridFilterDispatch } from './DataGridFilterContext.ts'
import { type DataGridFilter, emptyDataGridFilterValues } from './DataGridFilter.ts'

export interface DataGridFilterMenuProps {
  field: string
  filter: DataGridFilter
}

export function DataGridFilterMenu(props: DataGridFilterMenuProps) {
  const { field, filter } = props
  const { options } = filter
  const state = useDataGridFilterContext()
  const current = state[field] ?? emptyDataGridFilterValues
  const enabled = current.values.size > 0
  const dispatch = useDataGridFilterDispatch()
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant={enabled ? 'tertiary' : 'tertiary-neutral'}
          icon={enabled ? <FunnelFillIcon title="Kolonnen er filtrert" /> : <FunnelIcon title="Filtrer kolonne" />}
          size="xsmall"
        >
          {enabled ? <span>{`(${current.values.size})`}</span> : null}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label="Velg">
          {[...options].map((option) => {
            const [value, label] = option
            return (
              <ActionMenu.CheckboxItem
                key={value}
                checked={current.values.has(value)}
                onCheckedChange={(checked) => {
                  dispatch({
                    type: checked ? 'checked' : 'unchecked',
                    field,
                    value,
                  })
                }}
              >
                {label}
              </ActionMenu.CheckboxItem>
            )
          })}
          {enabled && (
            <ActionMenu.Item
              variant="danger"
              icon={<TrashIcon />}
              onSelect={() => {
                dispatch({
                  type: 'clear',
                  field,
                })
              }}
            >
              Fjern filter
            </ActionMenu.Item>
          )}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}
