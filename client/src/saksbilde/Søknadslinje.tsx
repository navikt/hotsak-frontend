import { HouseIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'
import { useLocation } from 'react-router'

import { useRequiredOppgaveContext } from '../oppgave/OppgaveContext.ts'
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

  const { oppgaveId } = useRequiredOppgaveContext()
  const basePath = oppgaveId ? `/oppgave/${oppgaveId}` : `/sak/${id}`

  return (
    <SøknadslinjeContainer>
      <Tabs value={location.pathname}>
        <Tabs.List>
          <TabLink to={`${basePath}/hjelpemidler`} icon={<HouseIcon />}>
            Hjelpemidler
          </TabLink>
          <TabLink to={`${basePath}/bruker`}>Bruker</TabLink>
          <TabLink to={`${basePath}/formidler`}>Formidler</TabLink>
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
