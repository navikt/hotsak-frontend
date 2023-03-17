import React from 'react'

import { Alert } from '@navikt/ds-react'

import { Avstand } from './Avstand'

export const SkjemaAlert: React.FC<{ variant: 'error' | 'info' | 'warning'; children: React.ReactNode }> = ({
  variant,
  children,
}) => {
  return (
    <Avstand paddingTop={4}>
      <Alert size="small" variant={variant}>
        {children}
      </Alert>
    </Avstand>
  )
}
