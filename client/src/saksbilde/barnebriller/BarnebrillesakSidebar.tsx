import { useEffect } from 'react'
import styled from 'styled-components'

import { ClockIcon, EnvelopeClosedIcon, NotePencilDashIcon, PersonGavelIcon } from '@navikt/aksel-icons'
import { Tabs, Tag, Tooltip } from '@navikt/ds-react'

import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { BarnebrilleSidebarTabs, HøyrekolonneTabs, StegType } from '../../types/types.internal'
import { SendBrevPanel } from '../høyrekolonne/brevutsending/SendBrevPanel'
import { HøyrekolonnePanel } from '../høyrekolonne/HøyrekolonnePanel'
import { Notater } from '../høyrekolonne/notat/Notater'
import { NotificationBadge } from '../høyrekolonne/notat/NotificationBadge'
import { useNotatTeller } from '../høyrekolonne/notat/useNotatTeller'
import { useBarnebrillesak } from '../useBarnebrillesak'
import { BarnebrillesakHistorikk } from './BarnebrillesakHistorikk'
import { useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { TotrinnskontrollPanel } from './steg/totrinnskontroll/TotrinnskontrollPanel'

const Sidebar = styled(Tabs)`
  border-left: 1px solid var(--a-border-default);
  height: 90vh;
  margin: 0;
  padding: 0;
`

export function BarnebrillesakSidebar() {
  const { sak } = useBarnebrillesak()
  const { valgtSidebarTab, setValgtSidebarTab } = useManuellSaksbehandlingContext()
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotatTeller(sak?.data.sakId)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak)

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
        <Tooltip content="Historikk">
          <Tabs.Tab value={BarnebrilleSidebarTabs.SAKSHISTORIKK} icon={<ClockIcon title="Historikk" />} />
        </Tooltip>
        <Tooltip content="Totrinnskontroll">
          <Tabs.Tab
            value={BarnebrilleSidebarTabs.TOTRINNSKONTROLL}
            icon={<PersonGavelIcon title="Totrinnskontroll" />}
          />
        </Tooltip>
        <Tooltip content="Send brev">
          <Tabs.Tab value={BarnebrilleSidebarTabs.SEND_BREV} icon={<EnvelopeClosedIcon title="Send brev" />} />
        </Tooltip>
        <Tooltip content="Notater">
          <Tabs.Tab
            value={BarnebrilleSidebarTabs.NOTAT}
            icon={
              <>
                <NotePencilDashIcon title="Notat" />
                {!henterNotater && (
                  <Tag variant="neutral-moderate" size="xsmall" style={{ position: 'relative' }}>
                    {antallNotater}
                    {harUtkast && <NotificationBadge />}
                  </Tag>
                )}
              </>
            }
          />
        </Tooltip>
      </Tabs.List>
      <Tabs.Panel value={BarnebrilleSidebarTabs.SAKSHISTORIKK.toString()}>
        <BarnebrillesakHistorikk />
      </Tabs.Panel>
      <Tabs.Panel value={BarnebrilleSidebarTabs.TOTRINNSKONTROLL.toString()}>
        <TotrinnskontrollPanel />
      </Tabs.Panel>
      <Tabs.Panel value={BarnebrilleSidebarTabs.SEND_BREV.toString()}>
        <SendBrevPanel sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
      </Tabs.Panel>
      <Tabs.Panel value={BarnebrilleSidebarTabs.NOTAT.toString()}>
        <HøyrekolonnePanel tittel="Notater">
          <Notater sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
        </HøyrekolonnePanel>
      </Tabs.Panel>
    </Sidebar>
  )
}
