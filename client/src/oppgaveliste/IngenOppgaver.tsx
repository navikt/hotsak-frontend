import styled from '@emotion/styled'
import dayjs from 'dayjs'

import { Sidetittel } from 'nav-frontend-typografi'

import { TabType } from '../tabs'

//import { useAktivTab } from './tabs';

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
  //const aktivTab = useAktivTab();
  var aktivTab = 'mine'

  switch (aktivTab) {
    case 'alle':
      return (
        <Container>
          <Tekst>Ingen nye saker å plukke</Tekst>
        </Container>
      )
    case 'mine':
      return (
        <Container>
          {/*<img alt="Tom brevkasse som smiler" src={brevkasse} />*/}
          <Tekst>Du har ingen tildelte saker</Tekst>
        </Container>
      )
    case 'ventende':
      return (
        <Container>
          {/*<img alt="Tom brevkasse som smiler" src={brevkasse} />*/}
          <Tekst>Du har ingen saker på vent</Tekst>
        </Container>
      )
    default:
      return null
  }
}
