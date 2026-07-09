import { FunnelFillIcon, FunnelIcon, TrashIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useMemo } from 'react'

import {
  type DataGridFilter,
  type DataGridFilterOption,
  type DataGridFilterValue,
  emptyDataGridFilterValues,
} from './DataGridFilter.ts'
import {
  type DataGridFilterAction,
  useDataGridFilterContext,
  useDataGridFilterDispatch,
  useDataGridFilterResetHandler,
} from './DataGridFilterContext.ts'

export interface DataGridFilterMenuProps<
  K extends string = string,
  V extends DataGridFilterValue = DataGridFilterValue,
> {
  field: K
  filter: DataGridFilter<V>
  scope: string
  useAllOptions?: boolean
  onFilterChange?(action: DataGridFilterAction<string, K>): void
}

export function DataGridFilterMenu<K extends string = string, V extends DataGridFilterValue = DataGridFilterValue>(
  props: DataGridFilterMenuProps<K, V>
) {
  const { field, filter, scope, useAllOptions, onFilterChange } = props
  const state = useDataGridFilterContext(scope)
  const current = state[field] ?? emptyDataGridFilterValues
  const options = useMemo(() => {
    const activeOptions = useAllOptions && filter.allOptions ? filter.allOptions : filter.options
    const result = mapOf(activeOptions)
    // legg til lagrede filterverdier som ikke lenger ligger i filter.options
    current.values.forEach((value) => {
      if (!result.has(value)) {
        result.set(value, value.toString())
      }
    })
    if (filter.sortOptions) {
      return [...result.entries()].sort(sortOptions)
    } else {
      return [...result.entries()]
    }
  }, [filter.options, filter.allOptions, filter.sortOptions, current.values, useAllOptions])
  const enabled = current.values.size > 0
  const dispatch = useDataGridFilterDispatch()
  const handleFilterReset = useDataGridFilterResetHandler(field, scope)
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
              key={value.toString()}
              checked={current.values.has(value)}
              onCheckedChange={(checked) => {
                const action: DataGridFilterAction<string, K> = {
                  type: checked ? 'addFieldValue' : 'removeFieldValue',
                  scope,
                  field,
                  value,
                }
                dispatch(action)
                if (onFilterChange) {
                  onFilterChange(action)
                }
              }}
            >
              {label}
            </ActionMenu.CheckboxItem>
          ))}
          {enabled && (
            <ActionMenu.Item variant="danger" icon={<TrashIcon />} onSelect={handleFilterReset}>
              Fjern filter
            </ActionMenu.Item>
          )}
        </ActionMenu.Group>
      </ActionMenu.Content>
    </ActionMenu>
  )
}

function mapOf(options: DataGridFilter['options']): Map<DataGridFilterValue, string> {
  const result = new Map<DataGridFilterValue, string>()
  for (const option of options) {
    const [value, label] = Array.isArray(option) ? option : [option, option]
    if (value && label) {
      result.set(value, label.toString())
    }
  }
  return result
}

function sortOptions(a: DataGridFilterOption, b: DataGridFilterOption): number {
  const [, aV] = a
  const [, bV] = b
  return aV.localeCompare(bV)
}
