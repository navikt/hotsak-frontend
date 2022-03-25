import { Alert } from '@navikt/ds-react'
import styled from 'styled-components/macro'

interface AlertErrorProps {
  error: Error
}

const FeilmeldingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`


export const AlertError = (props: AlertErrorProps) => {

  const { error } = props
  let error_: any = error
  if(error_.hasOwnProperty('statusCode')){
    if(error_.statusCode === 401){
      throw error
    }
  }
  return (
    <FeilmeldingContainer>
      <Alert size="small" variant="error">{error.message ? error.message : 'Klare ikke å hente saken. Dette kan skyldes en teknisk feil. Kontakt utviklerne i Digihot'}</Alert>
    </FeilmeldingContainer>
  )
}
