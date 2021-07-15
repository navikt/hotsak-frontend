import styled from '@emotion/styled'

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'

const Feiltekst = styled.div`
  padding-top: 2rem;
  * {
    padding: 1rem;
  }
`

export const GlobalFeilside = ({ error }: { error: Error }) => {
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
