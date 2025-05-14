import { HouseIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'

import { useLocation } from 'react-router'
import { Sakstype } from '../types/types.internal'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'
import { TabLink } from './TabLink'
import { Eksperiment } from '../felleskomponenter/Eksperiment'
import { Saksmeny } from './saksmeny/Saksmeny.tsx'

export interface SøknadslinjeProps {
  id: number | string
  type: Sakstype
}

export function Søknadslinje({ id, type }: SøknadslinjeProps) {
  const location = useLocation()
  return (
    <SøknadslinjeContainer>
      <Tabs value={location.pathname}>
        <Tabs.List>
          <TabLink to={`/sak/${id}/hjelpemidler`} title="Hjelpemidler" icon={<HouseIcon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`/sak/${id}/bruker`} title="Bruker">
            Bruker
          </TabLink>
          <TabLink to={`/sak/${id}/formidler`} title={type === Sakstype.BESTILLING ? 'Bestiller' : 'Formidler'}>
            Formidler
          </TabLink>
          <Eksperiment>
            <div style={{ alignSelf: 'center', margin: '0 var(--a-spacing-3) 0 auto' }}>
              <Saksmeny />
            </div>
          </Eksperiment>
        </Tabs.List>
      </Tabs>
    </SøknadslinjeContainer>
  )
}
