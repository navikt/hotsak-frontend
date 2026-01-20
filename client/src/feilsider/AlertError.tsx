import styled from 'styled-components'

import { Alert } from '@navikt/ds-react'
import { toError } from '../utils/error.ts'

export interface AlertErrorProps {
  error: unknown
}

export function AlertError(props: AlertErrorProps) {
  const error = toError(props.error)
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
