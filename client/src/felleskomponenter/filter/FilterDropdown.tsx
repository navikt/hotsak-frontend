import { Select } from '@navikt/ds-react'

import classes from './FilterDropdown.module.css'

export interface FilterDropdownProps {
  label: string
  value: string
  options: Map<string, string>
  handleChange(value: string): void
}

export function FilterDropdown({ label, value, options, handleChange }: FilterDropdownProps) {
  return (
    <Select
      className={classes.dropdown}
      label={label}
      size="small"
      value={value}
      onChange={(e) => handleChange(e.target.value)}
    >
      {[...options.entries()].sort(sorterAlfabetiskPåVerdi).map(([key, value]) => {
        return (
          <option key={key} value={key}>
            {value}
          </option>
        )
      })}
    </Select>
  )
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
