import styled from 'styled-components/macro'

import { Flex } from '../felleskomponenter/Flex'
import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { TabLink } from './TabLink'
import { useSak } from './sakHook'
import { HistorikkHeader } from './historikk/HistorikkHeader'

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

export enum Location {
  Hjelpemidler,
  Bruker,
  Formidler,
}

export const Søknadslinje = () => {
  const { saksid } = useSak().sak
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
      <HistorikkHeader />
    </Container>
  )
}

export default Søknadslinje
