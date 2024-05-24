import type { ReactNode } from 'react'

import { Alert } from '@navikt/ds-react'

import { Avstand } from './Avstand'

export function SkjemaAlert({
  variant,
  role,
  children,
}: {
  variant: 'error' | 'info' | 'warning'
  role?: 'alert' | 'status'
  children: ReactNode
}) {
  return (
    <Avstand paddingTop={4}>
      <Alert size="small" variant={variant} role={role}>
        {children}
      </Alert>
    </Avstand>
  )
}
