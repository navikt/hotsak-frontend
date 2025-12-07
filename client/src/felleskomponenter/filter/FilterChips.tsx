import { Chips } from '@navikt/ds-react'

import { FilterOption, isFilterOption } from './filterTypes.ts'

export interface FilterChipsProps<T extends string | number | symbol = string> {
  options: T[] | FilterOption[]
  selected: string[]
  handleChange(...args: any[]): any
  size?: 'medium' | 'small'
}

export function FilterChips(props: FilterChipsProps) {
  const { options, selected, handleChange, size = 'medium' } = props
  return (
    <Chips size={size}>
      {options.map((filter) => {
        const key = isFilterOption(filter) ? filter.key : filter
        const label = isFilterOption(filter) ? filter.label : filter
        return (
          <Chips.Toggle
            key={key}
            selected={selected.includes(key)}
            onClick={() => {
              handleChange(selected.includes(key) ? selected.filter((it) => it !== key) : [key])
            }}
          >
            {label}
          </Chips.Toggle>
        )
      })}
    </Chips>
  )
}
