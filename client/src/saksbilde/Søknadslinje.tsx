import styled from 'styled-components/macro'

import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { Routes } from '../routes'
import { TabLink } from './TabLink'
import { Flex } from '../felleskomponenter/Flex';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 48px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--navds-color-border);
  padding: 0 2rem 0 2rem;
  min-width: var(--speil-total-min-width);

  > div:last-of-type {
    margin-left: 1rem;
  }
`

const TabList = styled.span`
  display: flex;
`

export const Søknadslinje = () => {
  return (
    <Container>
      <Flex>
        <TabList role="tablist">
          <TabLink to={Routes.Saksbilde} title="Hjelpemidler" icon={<HjemIkon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={Routes.Bruker} title="Bruker">
            Bruker
          </TabLink>
          <TabLink to={Routes.Formidler} title="Formidler">
            Formidler
          </TabLink>
        </TabList>
      </Flex>
    </Container>
  )
}

export default Søknadslinje
