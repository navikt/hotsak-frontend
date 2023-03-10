import styled from 'styled-components'

import { Flex } from '../felleskomponenter/Flex'
import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { HøyrekolonneTabs, Oppgavetype } from '../types/types.internal'
import { TabLink } from './TabLink'
import { HøyrekolonneHeader } from './høyrekolonne/HøyrekolonneHeader'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'

export enum Location {
  Hjelpemidler,
  Bruker,
  Formidler,
}

export interface SøknadslinjeProps {
  id: string
  type: Oppgavetype
  onTabChange: (...args: any[]) => any
  currentTab: HøyrekolonneTabs
}

const TabList = styled.span`
  display: flex;
`

export const Søknadslinje: React.FC<SøknadslinjeProps> = ({ id, type, onTabChange, currentTab }) => {
  return (
    <SøknadslinjeContainer>
      <Flex>
        <TabList role="tablist">
          <TabLink to={`/sak/${id}/hjelpemidler`} title="Hjelpemidler" icon={<HjemIkon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`/sak/${id}/bruker`} title="Bruker">
            Bruker
          </TabLink>
          <TabLink to={`/sak/${id}/formidler`} title={type === Oppgavetype.BESTILLING ? 'Bestiller' : 'Formidler'}>
            Formidler
          </TabLink>
        </TabList>
      </Flex>
      <HøyrekolonneHeader id={id} type={type} onTabChange={onTabChange} currentTab={currentTab} />
    </SøknadslinjeContainer>
  )
}

export default Søknadslinje
