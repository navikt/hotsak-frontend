import { Title } from '@navikt/ds-react'
import styled from 'styled-components/macro'
import { Tekst } from '../../felleskomponenter/typografi'


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
        <Tekst>{`${navn} har godkjent søknaden selv på nav.no`}</Tekst> 
      </Container>
      </>
    )
  }
