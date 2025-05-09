import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { Liste } from '../../felleskomponenter/Liste'
import { Brødtekst } from '../../felleskomponenter/typografi'

export function IkkkeInnhentetFordiKunTilbehørV2() {
  return (
    <>
      <Heading level="1" size="medium" spacing={true}>
        Fullmakt
      </Heading>
      <Container>
        <Liste>
          <li>
            <Brødtekst>
              Formidler må ikke å innhente fullmakt for å søke om tilbehøret. Nav går ut fra at fullmakt ble hentet inn
              da det ble søkt om hjelpemiddelet tilbehøret skal brukes sammen med.
            </Brødtekst>
          </li>
          <li>
            <Brødtekst>
              Formidler bekrefter at innbygger ønsker at hen melder behov for tilbehøret. Innbygger er kjent med hvilket
              tilbehør formidler søker om.
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
