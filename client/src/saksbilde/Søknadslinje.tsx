import styled from 'styled-components/macro'

import { hotsakTotalMinWidth } from '../GlobalStyles'
import { Flex } from '../felleskomponenter/Flex'
import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { HøyrekolonneTabs, Oppgavetype } from '../types/types.internal'
import { TabLink } from './TabLink'
import { HøyrekolonneHeader } from './høyrekolonne/HøyrekolonneHeader'

const Container = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 48px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--navds-semantic-color-border-muted);
  padding: 0 0 0 2rem;
  min-width: ${hotsakTotalMinWidth};

  > div:last-of-type {
    margin-left: 1rem;
  }
`

const TabList = styled.span`
  display: flex;
`

export enum Location {
  Hjelpemidler,
  Bruker,
  Formidler,
}

export interface SøknadslinjeProps {
  id: string
  type: Oppgavetype
  onTabChange: Function
  currentTab: HøyrekolonneTabs
}

export const Søknadslinje: React.VFC<SøknadslinjeProps> = ({ id, type, onTabChange, currentTab }) => {
  const basepath = type === Oppgavetype.BESTILLING ? 'bestilling' : 'sak'
  return (
    <Container>
      <Flex>
        <TabList role="tablist">
          <TabLink to={`/${basepath}/${id}/hjelpemidler`} title="Hjelpemidler" icon={<HjemIkon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`/${basepath}/${id}/bruker`} title="Bruker">
            Bruker
          </TabLink>
          <TabLink
            to={`/${basepath}/${id}/formidler`}
            title={type === Oppgavetype.BESTILLING ? 'Bestiller' : 'Formidler'}
          >
            Formidler
          </TabLink>
        </TabList>
      </Flex>
      <HøyrekolonneHeader id={id} type={type} onTabChange={onTabChange} currentTab={currentTab} />
    </Container>
  )
}

export default Søknadslinje
