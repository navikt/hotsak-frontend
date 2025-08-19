import { Select } from '@navikt/ds-react'
import styled from 'styled-components'

export interface FilterDropdownProps {
  label: string
  value: string
  options: Map<string, string>
  handleChange(...args: any[]): any
}

export function FilterDropdown({ label, value, options, handleChange }: FilterDropdownProps) {
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

const Dropdown = styled(Select)`
  width: 210px;
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
