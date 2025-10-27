import { HouseIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'
import { useLocation } from 'react-router'

import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'
import { SaksbildeMenu } from './SaksbildeMenu.tsx'
import { TabLink } from './TabLink'

export interface SøknadslinjeProps {
  id: number | string
  skjulSaksmeny?: boolean
}

export function Søknadslinje({ id, skjulSaksmeny = false }: SøknadslinjeProps) {
  const location = useLocation()

  const { oppgaveId, isOppgaveContext } = useOppgaveContext()
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
          {isOppgaveContext && !skjulSaksmeny && (
            <div style={{ alignSelf: 'center', margin: '0 var(--ax-space-12) 0 auto' }}>
              <SaksbildeMenu spørreundersøkelseId="sak_overført_gosys_v1" />
            </div>
          )}
        </Tabs.List>
      </Tabs>
    </SøknadslinjeContainer>
  )
}
