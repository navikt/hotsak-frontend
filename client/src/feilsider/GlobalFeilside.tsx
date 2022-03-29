import styled from 'styled-components/macro'

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'
import { IkkeLoggetInn } from '../routes/IkkeLoggetInn'

const Feiltekst = styled.div`
  padding-top: 2rem;
  * {
    padding: 1rem;
  }
`

export const GlobalFeilside = ({ error }: { error: Error }) => {

  let error_: any = error
  
  return (

    <>
      {error_.hasOwnProperty("statusCode") && error_.statusCode === 401
        ? <IkkeLoggetInn />
        : <>
        <Varsel type={Varseltype.Advarsel}>Siden kan dessverre ikke vises</Varsel>
        <Feiltekst>
          Du kan forsøke å laste siden på nytt, eller lukke nettleservinduet og logge inn på nytt.
          <pre>{error.stack}</pre>
        </Feiltekst>
      </>
      }
    </>
  )
  


}
