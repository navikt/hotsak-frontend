import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { Liste } from '../../felleskomponenter/Liste'
import { Brødtekst } from '../../felleskomponenter/typografi'

export function IkkkeInnhentetFordiKunTilbehør() {
  return (
    <>
      <Heading level="1" size="medium" spacing={true}>
        Fullmakt
      </Heading>
      <Container>
        <Liste>
          <li>
            <Brødtekst>
              Det er ikke innhentet fullmakt i denne saken, da Nav i en tidsbegrenset periode ønsker mer kunnskap om
              hvorfor det meldes behov for tilbehør i etterkant av en søknad/vedtak om hjelpemiddel.
            </Brødtekst>
          </li>
        </Liste>
      </Container>
    </>
  )
}

const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`
