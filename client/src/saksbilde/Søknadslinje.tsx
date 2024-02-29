import { useState } from 'react'
import { Eksperiment } from '../felleskomponenter/Eksperiment'
import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { HøyrekolonneTabs, Sakstype } from '../types/types.internal'
import { TabLink } from './TabLink'
import { HøyrekolonneHeader } from './høyrekolonne/HøyrekolonneHeader'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'
import { Button, Tabs, VStack } from '@navikt/ds-react'
import { HeitKrukka } from '../heitKrukka/HeitKrukka'

export interface SøknadslinjeProps {
  id: number | string
  type: Sakstype
  onTabChange: (...args: any[]) => any
  currentTab: HøyrekolonneTabs
}

export const Søknadslinje: React.FC<SøknadslinjeProps> = ({ id, type, onTabChange, currentTab }) => {
  const [feedbackOpen, setFeedbackOpen] = useState(false)

  return (
    <>
    <SøknadslinjeContainer>
      <Tabs>
        <Tabs.List>
          <TabLink to={`/sak/${id}/hjelpemidler`} title="Hjelpemidler" icon={<HjemIkon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`/sak/${id}/bruker`} title="Bruker">
            Bruker
          </TabLink>
          <TabLink to={`/sak/${id}/formidler`} title={type === Sakstype.BESTILLING ? 'Bestiller' : 'Formidler'}>
            Formidler
          </TabLink>
        </Tabs.List>
      </Tabs>
      <Eksperiment>
        <VStack justify="center">
          <Button size="small" variant="secondary-neutral" onClick={() => setFeedbackOpen(true)} >
            Kort innpå
          </Button>
        </VStack>
      </Eksperiment>
      <HøyrekolonneHeader id={id} type={type} onTabChange={onTabChange} currentTab={currentTab} />
    </SøknadslinjeContainer>

<Eksperiment>
    <HeitKrukka open={feedbackOpen} onClose={() => setFeedbackOpen(false)}  />
    </Eksperiment>
    </>
  )
}
