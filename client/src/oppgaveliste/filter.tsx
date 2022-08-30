import React from 'react'
import styled from 'styled-components'

import { Button, Select } from '@navikt/ds-react'

import { ButtonContainer } from '../felleskomponenter/Dialogboks'

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
  const filterOptions = Array.from(options.keys())
  return (
    <Dropdown label={label} size="small" value={value} onChange={(e) => handleChange(e.target.value)}>
      {filterOptions.map((it) => (
        <option key={it} value={it}>
          {options.get(it)}
        </option>
      ))}
    </Dropdown>
  )
}

interface FiltersProps {
  children: React.ReactNode
  onClear: (...args: any[]) => any
}

export const Filters: React.FC<FiltersProps> = ({ children, onClear }) => {
  return (
    <FilterList>
      {children}
      <ButtonContainer>
        <Button variant="tertiary" size="small" onClick={() => onClear()}>
          Tilbakestill filtre
        </Button>
      </ButtonContainer>
    </FilterList>
  )
}
