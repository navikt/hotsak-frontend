import React from 'react'
import styled from 'styled-components/macro'

import { Heading } from '@navikt/ds-react'

import { Liste } from '../../felleskomponenter/Liste'
import { Tekst } from '../../felleskomponenter/typografi'

interface FullmaktFritakProps {
  navn: string
}

const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`

export const FullmaktFritak: React.VFC<FullmaktFritakProps> = ({ navn }) => {
  return (
    <>
      <Heading level="1" size="medium" spacing={true}>
        Fullmakt med fritak for signatur
      </Heading>
      <Container>
        <Liste>
          <li>
            <Tekst>Fullmakt på papir er ikke innhentet på grunn av korona-situasjonen</Tekst>
          </li>
          <li>
            <Tekst>
              {`${navn} er kjent med hvilke hjelpemidler det søkes om, er informert om sine rettigheter og plikter, og om at NAV kan innhente nødvendige opplysninger for å behandle søknaden.`}{' '}
            </Tekst>{' '}
          </li>
        </Liste>
      </Container>
    </>
  )
}
