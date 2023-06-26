import { useEffect } from 'react'
import styled from 'styled-components'

import { ClockIcon, EnvelopeClosedIcon, PencilWritingIcon, PersonGavelIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'

import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { HøyrekolonneTabs, StegType } from '../../types/types.internal'
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
        <Tabs.Tab value={HøyrekolonneTabs.SAKSHISTORIKK} icon={<ClockIcon />} />
        <Tabs.Tab value={HøyrekolonneTabs.TOTRINNSKONTROLL} icon={<PersonGavelIcon />} />
        {/*<Tabs.Tab value={HøyrekolonneTabs.SEND_BREV} icon={<EnvelopeClosedIcon />} />*/}
        <Tabs.Tab value={HøyrekolonneTabs.NOTAT} icon={<PencilWritingIcon />} />
      </Tabs.List>
      <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK.toString()}>
        <BrilleHistorikk />
      </Tabs.Panel>
      <Tabs.Panel value={HøyrekolonneTabs.TOTRINNSKONTROLL.toString()}>
        <TotrinnskontrollPanel />
      </Tabs.Panel>
      {/*<Tabs.Panel value={HøyrekolonneTabs.SEND_BREV.toString()}>
        <SendBrevPanel sakId={sak?.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
      </Tabs.Panel>*/}
      <Tabs.Panel value={HøyrekolonneTabs.NOTAT.toString()}>
        <Saksnotater sakId={sak?.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
      </Tabs.Panel>
    </Sidebar>
  )
}
