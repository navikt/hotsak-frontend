import React from 'react'
import styled from 'styled-components'

import { hotsakTotalMinWidth } from '../GlobalStyles'
import { Flex } from '../felleskomponenter/Flex'
import { TabLink } from '../saksbilde/TabLink'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  height: 48px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--a-border-default);
  padding: 0 0 0 2rem;
  min-width: ${hotsakTotalMinWidth};
  white-space: nowrap;

  > div:last-of-type {
    margin-left: 1rem;
  }
`

const TabList = styled.span`
  display: flex;
`

interface SaksoversiktLinjeProps {
  sakerCount: number
  hjelpemidlerCount: number
}

export const SaksoversiktLinje: React.FC<SaksoversiktLinjeProps> = ({ sakerCount, hjelpemidlerCount }) => {
  return (
    <Container>
      <Flex>
        <TabList role="tablist">
          <TabLink to={`/personoversikt/saker`} title={`Saker (${sakerCount})`}>
            {`Saker (${sakerCount})`}
          </TabLink>
          <TabLink to={`/personoversikt/hjelpemidler`} title={`Utlånsoversikt (${hjelpemidlerCount})`}>
            {`Utlånsoversikt (${hjelpemidlerCount})`}
          </TabLink>
        </TabList>
      </Flex>
    </Container>
  )
}

export default SaksoversiktLinje
