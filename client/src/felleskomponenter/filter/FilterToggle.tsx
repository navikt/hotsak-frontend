import { Switch } from '@navikt/ds-react'

import classes from './FilterToggle.module.css'

export interface FilterToggleProps {
  label: string
  value: boolean
  handleChange(checked: boolean): void
}

export function FilterToggle({ label, value, handleChange }: FilterToggleProps) {
  return (
    <div className={classes.toggleContainer}>
      <Switch checked={value} onChange={(e) => handleChange(e.target.checked)} size="small">
        {label}
      </Switch>
    </div>
  )
}
