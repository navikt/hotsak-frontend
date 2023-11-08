import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { HøyrekolonneTabs, Oppgavetype } from '../types/types.internal'
import { TabLink } from './TabLink'
import { HøyrekolonneHeader } from './høyrekolonne/HøyrekolonneHeader'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'
import { Tabs } from '@navikt/ds-react'

export interface SøknadslinjeProps {
  id: number | string
  type: Oppgavetype
  onTabChange: (...args: any[]) => any
  currentTab: HøyrekolonneTabs
}

export const Søknadslinje: React.FC<SøknadslinjeProps> = ({ id, type, onTabChange, currentTab }) => {
  return (
    <SøknadslinjeContainer>
      <Tabs>
        <Tabs.List>
          <TabLink to={`/sak/${id}/hjelpemidler`} title="Hjelpemidler" icon={<HjemIkon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`/sak/${id}/bruker`} title="Bruker">
            Bruker
          </TabLink>
          <TabLink to={`/sak/${id}/formidler`} title={type === Oppgavetype.BESTILLING ? 'Bestiller' : 'Formidler'}>
            Formidler
          </TabLink>
        </Tabs.List>
      </Tabs>
      <HøyrekolonneHeader id={id} type={type} onTabChange={onTabChange} currentTab={currentTab} />
    </SøknadslinjeContainer>
  )
}
