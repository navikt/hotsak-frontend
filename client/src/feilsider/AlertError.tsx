import * as Sentry from '@sentry/browser'
import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Alert } from '@navikt/ds-react'

const FeilmeldingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

export const AlertError: React.FC<{
  error: Error
}> = (props) => {
  const { error } = props
  const error_: any = error

  useEffect(() => {
    if (error) Sentry.captureException(error)
  }, [error])

  if (Object.prototype.hasOwnProperty.call(error_, 'statusCode')) {
    if (error_.statusCode === 401) {
      throw error
    }
  }
  return (
    <FeilmeldingContainer>
      <Alert size="small" variant="error">
        {error.message
          ? error.message
          : 'Klare ikke å hente saken. Dette kan skyldes en teknisk feil. Kontakt utviklerne i Digihot'}
      </Alert>
    </FeilmeldingContainer>
  )
}
