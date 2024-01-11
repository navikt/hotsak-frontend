import React from 'react'

import { Alert } from '@navikt/ds-react'

import { Avstand } from './Avstand'

export const SkjemaAlert: React.FC<{
  variant: 'error' | 'info' | 'warning'
  role?: 'alert' | 'status'
  children: React.ReactNode
}> = ({ variant, role, children }) => {
  return (
    <Avstand paddingTop={4}>
      <Alert size="small" variant={variant} role={role}>
        {children}
      </Alert>
    </Avstand>
  )
}
