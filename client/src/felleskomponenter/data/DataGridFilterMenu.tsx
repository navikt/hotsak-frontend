import { FunnelFillIcon, FunnelIcon, TrashIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

import { useDataGridFilterContext, useDataGridFilterDispatch } from './DataGridFilterContext.ts'

export interface DataGridFilterOption {
  value: string
  label: string
}

export interface DataGridFilter<K = string> {
  columnKey: K
  displayName: string
  options: string[] | DataGridFilterOption[]
}

export interface DataGridFilterMenuProps extends DataGridFilter {
  test?: string
}

export function DataGridFilterMenu(props: DataGridFilterMenuProps) {
  const { columnKey, displayName, options } = props
  const state = useDataGridFilterContext()
  const current = state[columnKey] ?? { values: [] }
  const enabled = current.values.length > 0
  const dispatch = useDataGridFilterDispatch()
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant={enabled ? 'tertiary' : 'tertiary-neutral'}
          icon={enabled ? <FunnelFillIcon title="Kolonnen er filtrert" /> : <FunnelIcon title="Filtrer kolonne" />}
          size="xsmall"
        >
          {enabled && <Indicator count={current.values.length} />}
        </Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <ActionMenu.Group label={displayName}>
          {options.map((option) => {
            let value, label: string
            if (isDataGridFilterOption(option)) {
              value = option.value
              label = option.label
            } else {
              value = option
              label = option
            }
            return (
              <ActionMenu.CheckboxItem
                key={value}
                checked={current.values.includes(value)}
                onCheckedChange={(checked) => {
                  dispatch({
                    type: checked ? 'checked' : 'unchecked',
                    columnKey,
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
                  columnKey,
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

function isDataGridFilterOption(value: unknown): value is DataGridFilterOption {
  return value != null && (value as DataGridFilterOption).value != null && (value as DataGridFilterOption).label != null
}

function Indicator({ count }: { count: number }) {
  return <span>{`(${count})`}</span>
}
