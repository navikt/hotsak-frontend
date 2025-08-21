import { ToggleGroup } from '@navikt/ds-react'

import type { FilterOption } from './filterTypes.ts'

export interface FilterToggleGroupProps {
  label: string
  value: string
  options: FilterOption[]
  handleChange(...args: any[]): any
}

export function FilterToggleGroup({ label, value, options, handleChange }: FilterToggleGroupProps) {
  return (
    <ToggleGroup
      label={label}
      value={value}
      size="small"
      onChange={(filterValue) => {
        handleChange(filterValue)
      }}
      style={{ background: 'var(--ax-bg-default)' }}
    >
      {options.map((option) => {
        return <ToggleGroup.Item key={option.key} value={option.key} label={option.label} />
      })}
    </ToggleGroup>
  )
}
