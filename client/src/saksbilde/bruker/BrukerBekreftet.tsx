import React from 'react'
import styled from 'styled-components/macro'

import { Heading } from '@navikt/ds-react'

import { Brødtekst } from '../../felleskomponenter/typografi'

interface BrukerBekreftetProps {
  navn: string
}

const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`

export const BrukerBekreftet: React.VFC<BrukerBekreftetProps> = ({ navn }) => {
  return (
    <>
      <Heading level="1" size="medium" spacing={true}>
        Bruker har godkjent søknaden
      </Heading>
      <Container>
        <Brødtekst>{`${navn} har godkjent søknaden selv på nav.no`}</Brødtekst>
      </Container>
    </>
  )
}
