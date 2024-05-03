import { Tabs } from '@navikt/ds-react'
import { Sakstype } from '../types/types.internal'
import { TabLink } from './TabLink'
import { SøknadslinjeContainer } from './komponenter/SøknadslinjeContainer'
import { HouseIcon } from '@navikt/aksel-icons'

export interface SøknadslinjeProps {
  id: number | string
  type: Sakstype
}

export function Søknadslinje({ id, type }: SøknadslinjeProps) {
  return (
    <>
      <SøknadslinjeContainer>
        <Tabs>
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
          </Tabs.List>
        </Tabs>
      </SøknadslinjeContainer>
    </>
  )
}
