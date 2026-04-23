import { Alert } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import { Tekst } from '../typografi'
import classes from './FeilmeldingAlert.module.css'

export function FeilmeldingAlert({ children }: { children: ReactNode }) {
  return (
    <Alert className={classes.root} size="small" variant="error">
      <Tekst>{children}</Tekst>
    </Alert>
  )
}
