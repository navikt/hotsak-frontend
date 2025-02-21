import { HouseIcon } from '@navikt/aksel-icons'
import { Tabs, Tag } from '@navikt/ds-react'

import { useLocation } from 'react-router'
import { Sakstype } from '../types/types.internal'
import { Eksperiment } from '../felleskomponenter/Eksperiment'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'
import { TabLink } from './TabLink'

export interface SøknadslinjeProps {
  id: number | string
  type: Sakstype
}

export function Søknadslinje({ id, type }: SøknadslinjeProps) {
  const location = useLocation()
  return (
    <>
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
            {/* Foreløpig kommentert ut frem til vi vet om det er behov for en saksmeny. Foreløpig kan ikke saksbehandler henlegge saker manuelt. Det skjer bare automatisk med død<Eksperiment>
              <div style={{ alignSelf: 'center', margin: '0 var(--a-spacing-3) 0 auto' }}>
                <Saksmeny />
              </div>
            </Eksperiment>*/}
            <Eksperiment>
              <TabLink to={`/sak/${id}/merknader`} title="Merknader">
                Journalføringsnotat
                <Tag variant="alt3-moderate" size="xsmall" style={{ marginLeft: '0.5em' }}>
                  3
                </Tag>
              </TabLink>
            </Eksperiment>
          </Tabs.List>
        </Tabs>
      </SøknadslinjeContainer>
    </>
  )
}
