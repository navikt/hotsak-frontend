import { Tabs } from '@navikt/ds-react'
import { HjemIkon } from '../felleskomponenter/ikoner/HjemIkon'
import { Sakstype } from '../types/types.internal'
import { TabLink } from './TabLink'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'

export interface SøknadslinjeProps {
  id: number | string
  type: Sakstype
}

export const Søknadslinje: React.FC<SøknadslinjeProps> = ({ id, type }) => {
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
      </SøknadslinjeContainer>
    </>
  )
}
