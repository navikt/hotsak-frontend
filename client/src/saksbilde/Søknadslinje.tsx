import styled from 'styled-components/macro'

import { hotsakTotalMinWidth } from '../GlobalStyles'
import { Flex } from '../felleskomponenter/Flex'
import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { HøyrekolonneTabs } from '../types/types.internal'
import { TabLink } from './TabLink'
import { HøyrekolonneHeader } from './høyrekolonne/HøyrekolonneHeader'
import { useSak } from './sakHook'

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
  onTabChange: Function
  currentTab: HøyrekolonneTabs
}

export const Søknadslinje: React.VFC<SøknadslinjeProps> = ({ onTabChange, currentTab }) => {
  const { sak } = useSak()
  if (!sak) return null
  const saksid = sak.saksid
  return (
    <Container>
      <Flex>
        <TabList role="tablist">
          <TabLink to={`/sak/${saksid}/hjelpemidler`} title="Hjelpemidler" icon={<HjemIkon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`/sak/${saksid}/bruker`} title="Bruker">
            Bruker
          </TabLink>
          <TabLink to={`/sak/${saksid}/formidler`} title="Formidler">
            Formidler
          </TabLink>
        </TabList>
      </Flex>
      <HøyrekolonneHeader onTabChange={onTabChange} currentTab={currentTab} />
    </Container>
  )
}

export default Søknadslinje
