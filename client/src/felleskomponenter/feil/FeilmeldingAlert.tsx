import { LocalAlert } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import classes from './FeilmeldingAlert.module.css'

export function FeilmeldingAlert({ children }: { children: ReactNode }) {
  return (
    <LocalAlert className={classes.root} status="error" size="small">
      <LocalAlert.Header>
        <LocalAlert.Title>{children}</LocalAlert.Title>
      </LocalAlert.Header>
    </LocalAlert>
  )
}
