import React from 'react'
import styled from 'styled-components'

import { Button, Select } from '@navikt/ds-react'

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

export const FilterDropdown: React.FC<FilterProps> = ({ label, value, options, handleChange }) => {
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

interface FiltersProps {
  children: React.ReactNode
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

export const Filters: React.FC<FiltersProps> = ({ children, onClear }) => {
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
