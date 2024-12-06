import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Button, Select, Switch, UNSAFE_Combobox } from '@navikt/ds-react'

import { Knappepanel } from '../felleskomponenter/Knappepanel'

const FilterList = styled.div`
  margin: 1rem 1.5rem 0.5rem;
  white-space: nowrap;
  display: flex;
  flex-wrap: nowrap;
`

const Dropdown = styled(Select)`
  padding-right: 1.5rem;
  width: 300px;
`

interface FilterProps {
  label: string
  value: string
  options: Map<string, string>
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

interface FiltersProps {
  children: ReactNode
  onClear: (...args: any[]) => any
}

function sorterAlfabetiskPåVerdi(a: [string, string], b: [string, string]) {
  if (a[1] < b[1]) {
    return -1
  }
  if (a[1] > b[1]) {
    return 1
  }
  return 0
}

export function Filters({ children, onClear }: FiltersProps) {
  return (
    <FilterList>
      {children}
      <Knappepanel>
        <Button variant="tertiary" size="small" onClick={() => onClear()}>
          Tilbakestill filtre
        </Button>
      </Knappepanel>
    </FilterList>
  )
}
