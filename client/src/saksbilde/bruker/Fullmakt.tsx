import styled from 'styled-components/macro'

import { Heading } from '@navikt/ds-react'

import { Liste } from '../../felleskomponenter/Liste'
import { Tekst } from '../../felleskomponenter/typografi'

interface FullmaktProps {
  navn: string
}

const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`

export const Fullmakt: React.FC<FullmaktProps> = ({ navn }) => {
  return (
    <>
      <Heading level="1" size="medium" spacing={true}>
        Fullmakt
      </Heading>
      <Container>
        <Liste>
          <li>
            <Tekst>{`${navn} har signert en fullmakt på at formidler fyller ut og begrunner søknad om hjelpemidler på sine vegne. ${navn} er kjent med hvilke hjelpemidler det søkes om og er informert om sine rettigheter og plikter.`}</Tekst>{' '}
          </li>
          <li>
            <Tekst>
              Fullmakten er arkivert i kommunens arkiv og kan vises frem på forespørsel fra NAV hjelpemiddelsentral.
            </Tekst>
          </li>
        </Liste>
      </Container>
    </>
  )
}
