import styled from 'styled-components'

import { Alert } from '@navikt/ds-react'

export interface AlertErrorProps {
  error: Error
}

export function AlertError(props: AlertErrorProps) {
  const { error } = props
  const error_: any = error

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
          : 'Klarte ikke å hente saken. Dette kan skyldes en teknisk feil. Kontakt utviklerne i DigiHoT.'}
      </Alert>
    </FeilmeldingContainer>
  )
}

const FeilmeldingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`
