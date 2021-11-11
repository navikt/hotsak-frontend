import styled from 'styled-components/macro'

import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'

const Feiltekst = styled.div`
  padding-top: 2rem;
  * {
    padding: 1rem;
  }
`

export const Feilside = ({ error }: { error: Error }) => {
  return (
    <>
      <Varsel type={Varseltype.Advarsel}>Ojda</Varsel>
      <Feiltekst>
        error
      </Feiltekst>
    </>
  )
}
