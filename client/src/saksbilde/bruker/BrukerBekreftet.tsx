import styled from 'styled-components/macro'

import { Heading } from '@navikt/ds-react'

import { Tekst } from '../../felleskomponenter/typografi'

interface BrukerBekreftetProps {
  navn: string
}

const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`

export const BrukerBekreftet: React.FC<BrukerBekreftetProps> = ({ navn }) => {
  return (
    <>
      <Heading level="1" size="medium" spacing={true}>
        Bruker har godkjent søknaden
      </Heading>
      <Container>
        <Tekst>{`${navn} har godkjent søknaden selv på nav.no`}</Tekst>
      </Container>
    </>
  )
}
