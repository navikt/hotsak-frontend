import styled from '@emotion/styled'
import { useTabContext } from './Oppgaveliste'
import { Sidetittel } from 'nav-frontend-typografi'
import { TabType } from './tabs'

const Container = styled.div`
  align-self: flex-start;
  width: max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
`

const Tekst = styled(Sidetittel)`
  margin: 2rem 0 0;
  font-size: 1.25rem;
  flex: 1;
`

export const IngenOppgaver = () => {
    const { aktivTab } = useTabContext()

  switch (aktivTab) {
    case TabType.Ufordelte:
      return (
        <Container>
          <Tekst>Ingen nye saker å plukke</Tekst>
        </Container>
      )
    case TabType.Mine:
      return (
        <Container>
          {/*<img alt="Tom brevkasse som smiler" src={brevkasse} />*/}
          <Tekst>Du har ingen tildelte saker</Tekst>
        </Container>
      )
    case TabType.OverførtGosys:
      return (
        <Container>
          {/*<img alt="Tom brevkasse som smiler" src={brevkasse} />*/}
          <Tekst>Ingen saker overført til Gosys</Tekst>
        </Container>
      )
      case TabType.Alle: 
      return (
        <Container>
          {/*<img alt="Tom brevkasse som smiler" src={brevkasse} />*/}
          <Tekst>Ingen saker funnet for din enhet</Tekst>
        </Container>
      )
    default:
      return null
  }
}
