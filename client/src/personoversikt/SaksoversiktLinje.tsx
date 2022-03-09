import styled from 'styled-components/macro'

import { Flex } from '../felleskomponenter/Flex'
import { hotsakTotalMinWidth } from '../GlobalStyles'
import { TabLink } from '../saksbilde/TabLink'

const Container = styled.div`
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

export const SaksoversiktLinje = () => {
  
  return (
    <Container>
      <Flex>
        <TabList role="tablist">
          <TabLink to={`/personoversikt/saker`} title="Saker">
            Saker
          </TabLink>
          <TabLink to={`/personoversikt/hjelpemidler`} title="Hjelpemidler">
            Hjelpemidler
          </TabLink>
        </TabList>
      </Flex>
    </Container>
  )
}

export default SaksoversiktLinje
