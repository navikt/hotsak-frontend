import { Alert } from '@navikt/ds-react'
import type { ReactNode } from 'react'

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
    <Alert size="small" variant={variant} role={role}>
      {children}
    </Alert>
  )
}
