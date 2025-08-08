import { HouseIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'

import { useLocation } from 'react-router'
import { useErSaksmenyPilot } from '../tilgang/useTilgang.ts'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'
import { Saksmeny } from './saksmeny/Saksmeny.tsx'
import { TabLink } from './TabLink'

export interface SøknadslinjeProps {
  id: number | string
}

export function Søknadslinje({ id }: SøknadslinjeProps) {
  const location = useLocation()
  const erSaksmenyPilot = useErSaksmenyPilot()
  return (
    <SøknadslinjeContainer>
      <Tabs value={location.pathname}>
        <Tabs.List>
          <TabLink to={`/sak/${id}/hjelpemidler`} icon={<HouseIcon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`/sak/${id}/bruker`}>Bruker</TabLink>
          <TabLink to={`/sak/${id}/formidler`}>Formidler</TabLink>
          {erSaksmenyPilot && (
            <div style={{ alignSelf: 'center', margin: '0 var(--a-spacing-3) 0 auto' }}>
              <Saksmeny />
            </div>
          )}
        </Tabs.List>
      </Tabs>
    </SøknadslinjeContainer>
  )
}
