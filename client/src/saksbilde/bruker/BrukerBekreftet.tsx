import { Title, BodyShort } from '@navikt/ds-react'
import styled from 'styled-components/macro'


interface BrukerBekreftetProps {
    navn: string
}

const Container = styled.div`
  padding-top: 1rem;
  padding-bottom: 2rem;
`


export const BrukerBekreftet: React.FC<BrukerBekreftetProps> = ({navn}) => {
    return (
        <>
        <Title level="1" size="m" spacing={true}>
        Bruker har godkjent søknaden
      </Title>
      <Container>
        <BodyShort size='s'>{`${navn} har godkjent søknaden selv på nav.no`}</BodyShort> 
      </Container>
      </>
    )
  }
