import { FunnelFillIcon, FunnelIcon, TrashIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useMemo } from 'react'

import { type DataGridFilter, type DataGridFilterOption, emptyDataGridFilterValues } from './DataGridFilter.ts'
import { useDataGridFilterContext, useDataGridFilterDispatch, useDataGridFilterReset } from './DataGridFilterContext.ts'

export interface DataGridFilterMenuProps {
  field: string
  filter: DataGridFilter
}

export function DataGridFilterMenu(props: DataGridFilterMenuProps) {
  const { field, filter } = props
  const state = useDataGridFilterContext()
  const current = state[field] ?? emptyDataGridFilterValues
  const options = useMemo(() => {
    const result = mapOf(filter.options)
    // legg til lagrede filterverdier som ikke lenger ligger i filter.options
    current.values.forEach((value) => {
      if (!result.has(value)) {
        result.set(value, value)
      }
    })
    return [...result.entries()].sort(sortOptions)
  }, [filter.options, current.values])
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

function mapOf(options: DataGridFilter['options']): Map<string, string> {
  const result = new Map<string, string>()
  for (const option of options) {
    const [value, label] = Array.isArray(option) ? option : [option, option]
    if (value && label) {
      result.set(value, label)
    }
  }
  return result
}

function sortOptions(a: DataGridFilterOption, b: DataGridFilterOption): number {
  const [, aV] = a
  const [, bV] = b
  return aV.localeCompare(bV)
}
