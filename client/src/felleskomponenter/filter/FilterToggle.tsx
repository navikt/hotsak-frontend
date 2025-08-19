import { Switch } from '@navikt/ds-react'
import styled from 'styled-components'

export interface FilterToggleProps {
  label: string
  value: boolean
  handleChange(...args: any[]): any
}

export function FilterToggle({ label, value, handleChange }: FilterToggleProps) {
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
