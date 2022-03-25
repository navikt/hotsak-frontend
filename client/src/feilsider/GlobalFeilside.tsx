import styled from 'styled-components/macro'

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'
import { Redirect } from 'react-router'

const Feiltekst = styled.div`
  padding-top: 2rem;
  * {
    padding: 1rem;
  }
`

export const GlobalFeilside = ({ error }: { error: Error }) => {

  let error_: any = error
  if(error_.hasOwnProperty('statusCode')){
    if(error_.statusCode === 401){
      <Redirect to="/uautorisert" />
    }
  }

  return (
    <>
      <Varsel type={Varseltype.Advarsel}>Siden kan dessverre ikke vises</Varsel>
      <Feiltekst>
        Du kan forsøke å laste siden på nytt, eller lukke nettleservinduet og logge inn på nytt.
        <pre>{error.stack}</pre>
      </Feiltekst>
    </>
  )
}
