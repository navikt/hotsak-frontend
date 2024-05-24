import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { Brødtekst } from '../../felleskomponenter/typografi'

interface BrukerBekreftetProps {
  navn: string
}

const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`

export function BrukerBekreftet({ navn }: BrukerBekreftetProps) {
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
