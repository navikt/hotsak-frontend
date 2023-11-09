import { useEffect } from 'react'
import styled from 'styled-components'

import { ClockIcon, DocPencilIcon, EnvelopeClosedIcon, PersonGavelIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'

import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { BarnebrilleSidebarTabs, HøyrekolonneTabs, StegType } from '../../types/types.internal'
import { SendBrevPanel } from '../høyrekolonne/brevutsending/SendBrevPanel'
import { Saksnotater } from '../høyrekolonne/notat/Saksnotater'
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
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak?.data)

  useEffect(() => {
    if (sak?.data.steg === StegType.GODKJENNE) {
      setValgtSidebarTab(BarnebrilleSidebarTabs.TOTRINNSKONTROLL)
    }
  }, [])

  if (!sak) {
    return <></>
  }

  return (
    <Sidebar
      defaultValue={HøyrekolonneTabs.SAKSHISTORIKK.toString()}
      value={valgtSidebarTab}
      loop
      iconPosition="top"
      onChange={setValgtSidebarTab}
    >
      <Tabs.List>
        <Tabs.Tab value={BarnebrilleSidebarTabs.SAKSHISTORIKK} icon={<ClockIcon />} />
        <Tabs.Tab value={BarnebrilleSidebarTabs.TOTRINNSKONTROLL} icon={<PersonGavelIcon />} />
        <Tabs.Tab value={BarnebrilleSidebarTabs.SEND_BREV} icon={<EnvelopeClosedIcon />} />
        <Tabs.Tab value={BarnebrilleSidebarTabs.NOTAT} icon={<DocPencilIcon />} />
      </Tabs.List>
      <Tabs.Panel value={BarnebrilleSidebarTabs.SAKSHISTORIKK.toString()}>
        <BrilleHistorikk />
      </Tabs.Panel>
      <Tabs.Panel value={BarnebrilleSidebarTabs.TOTRINNSKONTROLL.toString()}>
        <TotrinnskontrollPanel />
      </Tabs.Panel>
      <Tabs.Panel value={BarnebrilleSidebarTabs.SEND_BREV.toString()}>
        <SendBrevPanel sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
      </Tabs.Panel>
      <Tabs.Panel value={BarnebrilleSidebarTabs.NOTAT.toString()}>
        <Saksnotater sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
      </Tabs.Panel>
    </Sidebar>
  )
}
