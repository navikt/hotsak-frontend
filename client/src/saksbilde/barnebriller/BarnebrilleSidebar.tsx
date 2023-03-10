import { useEffect } from 'react'
import styled from 'styled-components'

import { Clock, Decision } from '@navikt/ds-icons'
import { Tabs } from '@navikt/ds-react'

import { hotsakHistorikkWidth } from '../../GlobalStyles'
import { HøyrekolonneTabs, StegType } from '../../types/types.internal'
import { Historikk } from '../høyrekolonne/historikk/Historikk'
import { useBrillesak, useSak } from '../sakHook'
import { useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { TotrinnskontrollPanel } from './steg/totrinnskontroll/TotrinnskontrollPanel'

const Header = styled.div`
  display: flex;
  height: 48px;
  width: ${hotsakHistorikkWidth};
  background-color: azure;
`
export const BarnebrilleSidebar: React.FC = () => {
  const { sak } = useBrillesak()
  const { valgtSidebarTab, setValgtSidebarTab } = useManuellSaksbehandlingContext()

  useEffect(() => {
    if (sak?.steg === StegType.GODKJENNE) {
      setValgtSidebarTab(HøyrekolonneTabs.TOTRINNSKONTROLL)
    }
  }, [])

  return (
    <Tabs
      defaultValue={HøyrekolonneTabs.SAKSHISTORIKK.toString()}
      value={valgtSidebarTab}
      loop
      onChange={setValgtSidebarTab}
    >
      <Tabs.List>
        <Tabs.Tab value={HøyrekolonneTabs.SAKSHISTORIKK} icon={<Clock />} />
        <Tabs.Tab value={HøyrekolonneTabs.TOTRINNSKONTROLL} icon={<Decision />} />
      </Tabs.List>
      <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK.toString()}>
        <Historikk />
      </Tabs.Panel>
      <Tabs.Panel value={HøyrekolonneTabs.TOTRINNSKONTROLL.toString()}>
        <TotrinnskontrollPanel />
      </Tabs.Panel>
    </Tabs>
  )
}
