import { useEffect } from 'react'
import styled from 'styled-components'

import { Clock, Decision } from '@navikt/ds-icons'
import { Tabs } from '@navikt/ds-react'

import { HøyrekolonneTabs, StegType } from '../../types/types.internal'
import { useBrillesak } from '../sakHook'
import { BrilleHistorikk } from './BrilleHistorikk'
import { useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { TotrinnskontrollPanel } from './steg/totrinnskontroll/TotrinnskontrollPanel'

const Sidebar = styled(Tabs)`
  border-left: 1px solid var(--a-border-default);
  height: 90vh;
  margin: 0;
  padding: 0;
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
    <Sidebar
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
        <BrilleHistorikk />
      </Tabs.Panel>
      <Tabs.Panel value={HøyrekolonneTabs.TOTRINNSKONTROLL.toString()}>
        <TotrinnskontrollPanel />
      </Tabs.Panel>
    </Sidebar>
  )
}
