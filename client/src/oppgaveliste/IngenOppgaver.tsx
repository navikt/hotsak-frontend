import styled from 'styled-components/macro'
import { Heading } from '@navikt/ds-react'

import { useTabContext } from './Oppgaveliste'
import { TabType } from './tabs'

const Container = styled.div`
  padding: 1rem;
`

export const IngenOppgaver = () => {
  const { aktivTab } = useTabContext()

  switch (aktivTab) {
    case TabType.Ufordelte:
      return (
        <Container>
          <Heading size="small">Ingen nye saker å plukke</Heading>
        </Container>
      )
    case TabType.Mine:
      return (
        <Container>
          <Heading size="small">Du har ingen tildelte saker</Heading>
        </Container>
      )
    case TabType.OverførtGosys:
      return (
        <Container>
          <Heading size="small">Ingen saker overført til Gosys</Heading>
        </Container>
      )
    case TabType.Alle:
      return (
        <Container>
          <Heading size="small">Ingen saker funnet for din enhet</Heading>
        </Container>
      )
    default:
      return null
  }
}
