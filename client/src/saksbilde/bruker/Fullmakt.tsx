import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { Liste } from '../../felleskomponenter/Liste'
import { Brødtekst } from '../../felleskomponenter/typografi'

interface FullmaktProps {
  navn: string
}

const Container = styled.div`
  padding-bottom: 2rem;
`

export function Fullmakt({ navn }: FullmaktProps) {
  return (
    <>
      <Heading level="1" size="medium">
        Fullmakt
      </Heading>
      <Container>
        <Liste>
          <li>
            <Brødtekst>{`${navn} har signert en fullmakt på at formidler fyller ut og begrunner søknad om hjelpemidler på sine vegne. ${navn} er kjent med hvilke hjelpemidler det søkes om og er informert om sine rettigheter og plikter.`}</Brødtekst>{' '}
          </li>
          <li>
            <Brødtekst>
              Fullmakten er arkivert i kommunens arkiv og kan vises frem på forespørsel fra Nav Hjelpemiddelsentral.
            </Brødtekst>
          </li>
        </Liste>
      </Container>
    </>
  )
}
