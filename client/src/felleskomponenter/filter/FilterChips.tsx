import { Chips, Label, VStack } from '@navikt/ds-react'

import type { FilterOption } from './filterTypes.ts'

export interface FilterChipsProps {
  label?: string
  selected: string[]
  options: FilterOption[]
  handleChange(...args: any[]): any
}

export function FilterChips({ label, selected, options, handleChange }: FilterChipsProps) {
  return (
    <VStack gap="3">
      {label && <Label size="small">{label}</Label>}
      <Chips size="medium">
        {options.map((filter) => {
          return (
            <Chips.Toggle
              key={filter.key}
              checkmark={false}
              selected={selected.includes(filter.key)}
              onClick={() => {
                handleChange(
                  selected.includes(filter.key)
                    ? selected.filter((x) => x !== filter.key)
                    : [/*...selected, */ filter.key]
                )
              }}
            >
              {filter.label}
            </Chips.Toggle>
          )
        })}
      </Chips>
    </VStack>
  )
}
