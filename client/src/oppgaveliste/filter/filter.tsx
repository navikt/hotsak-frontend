import styled from 'styled-components'

import { Chips, Label, Select, Switch, ToggleGroup, UNSAFE_Combobox, VStack } from '@navikt/ds-react'
import type { OppgaveFilterType } from '../../oppgave/oppgaveTypes.ts'

const Dropdown = styled(Select)`
  width: 210px;
`

interface FilterProps {
  label: string
  value: string
  options: Map<string, string>
  handleChange: (...args: any[]) => any
}

interface ToggleGroupProps {
  label: string
  value: string
  options: OppgaveFilterType[]
  handleChange: (...args: any[]) => any
}

interface ChipsProps {
  label?: string
  selected: string[]
  options: OppgaveFilterType[]
  handleChange: (...args: any[]) => any
}

interface ComboboxProps {
  label: string
  value: string
  options: string[]
}

export function FilterDropdown({ label, value, options, handleChange }: FilterProps) {
  return (
    <Dropdown label={label} size="small" value={value} onChange={(e) => handleChange(e.target.value)}>
      {[...options.entries()].sort(sorterAlfabetiskPåVerdi).map(([key, value]) => {
        return (
          <option key={key} value={key}>
            {value}
          </option>
        )
      })}
    </Dropdown>
  )
}

export function FilterToggleGroup({ label, value, options, handleChange }: ToggleGroupProps) {
  return (
    <ToggleGroup
      label={label}
      value={value}
      size="small"
      onChange={(filterValue) => {
        handleChange(filterValue)
      }}
      style={{ background: 'var(--a-bg-default)' }}
    >
      {options.map((option) => {
        return <ToggleGroup.Item key={option.key} value={option.key} label={option.label} />
      })}
    </ToggleGroup>
  )
}

export function FilterChips({ label, selected, options, handleChange }: ChipsProps) {
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

export function FilterCombobox({ label, value, options }: ComboboxProps) {
  return (
    <UNSAFE_Combobox size="small" allowNewValues={false} value={value} label={label} isMultiSelect options={options} />
  )
}

export function FilterToggle({
  label,
  value,
  handleChange,
}: {
  label: string
  value: boolean
  handleChange: (...args: any[]) => any
}) {
  return (
    <ToggleContainer>
      <Switch checked={value} onChange={(e) => handleChange(e.target.checked)} size="small">
        {label}
      </Switch>
    </ToggleContainer>
  )
}

const ToggleContainer = styled.div`
  display: flex;
  align-items: flex-end;
  padding-right: var(--a-spacing-4);
`

function sorterAlfabetiskPåVerdi(a: [string, string], b: [string, string]) {
  if (a[1] < b[1]) {
    return -1
  }
  if (a[1] > b[1]) {
    return 1
  }
  return 0
}
