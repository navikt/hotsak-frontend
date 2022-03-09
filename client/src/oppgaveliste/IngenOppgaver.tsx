import styled from 'styled-components/macro'
import { Heading } from '@navikt/ds-react'

const Container = styled.div`
  padding: 1rem;
`

export const IngenOppgaver = () => {
  return (
    <Container>
      <Heading size="small">Ingen saker funnet</Heading>
    </Container>
  )
}

export const IngentingFunnet:React.FC = ({ children }) => {
    return (
      <Container>
        <Heading size="small">{children}</Heading>
      </Container>
    )
  }
