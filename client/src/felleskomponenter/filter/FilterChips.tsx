import { Chips, Label, VStack } from '@navikt/ds-react'

import { FilterOption, isFilterOption } from './filterTypes.ts'

export interface FilterChipsProps<T extends string | number | symbol = string> {
  checkmark?: boolean
  label?: string
  labels?: Record<T, string>
  multiple?: boolean
  options: T[] | FilterOption[]
  selected: string[]
  size?: 'medium' | 'small'
  handleChange(...args: any[]): any
}

export function FilterChips(props: FilterChipsProps) {
  const { checkmark = false, handleChange, label, labels, multiple, options, selected, size = 'medium' } = props
  return (
    <VStack gap="3">
      {label && <Label size={size}>{label}</Label>}
      <Chips size={size}>
        {options.map((filter) => {
          const key = isFilterOption(filter) ? filter.key : filter
          const label = isFilterOption(filter) ? filter.key : (labels?.[filter] ?? filter)
          return (
            <Chips.Toggle
              key={key}
              checkmark={checkmark}
              selected={selected.includes(key)}
              onClick={() => {
                handleChange(
                  selected.includes(key) ? selected.filter((it) => it !== key) : multiple ? [...selected, key] : [key]
                )
              }}
            >
              {label}
            </Chips.Toggle>
          )
        })}
      </Chips>
    </VStack>
  )
}
