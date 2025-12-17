import { useMemo } from 'react'
import { FunnelFillIcon, FunnelIcon, TrashIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

import { useDataGridFilterContext, useDataGridFilterDispatch, useDataGridFilterReset } from './DataGridFilterContext.ts'
import { type DataGridFilter, type DataGridFilterOption, emptyDataGridFilterValues } from './DataGridFilter.ts'

export interface DataGridFilterMenuProps {
  field: string
  filter: DataGridFilter
}

export function DataGridFilterMenu(props: DataGridFilterMenuProps) {
  const { field, filter } = props
  const options = useMemo(() => {
    return [...filter.options]
      .map((option): DataGridFilterOption => (Array.isArray(option) ? option : [option, option]))
      .filter(([value, label]) => Boolean(value) && Boolean(label))
      .sort(sortOptions)
  }, [filter.options])
  const state = useDataGridFilterContext()
  const current = state[field] ?? emptyDataGridFilterValues
  const enabled = current.values.size > 0
  const dispatch = useDataGridFilterDispatch()
  const handleReset = useDataGridFilterReset(field)
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
        <ActionMenu.Group label="Inkluder følgende">
          {options.map(([value, label]) => (
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
          ))}
          {enabled && (
            <ActionMenu.Item variant="danger" icon={<TrashIcon />} onSelect={handleReset}>
              Fjern filter
            </ActionMenu.Item>
          )}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function sortOptions(a: DataGridFilterOption, b: DataGridFilterOption): number {
  const [, aV] = a
  const [, bV] = b
  return aV.localeCompare(bV)
}
