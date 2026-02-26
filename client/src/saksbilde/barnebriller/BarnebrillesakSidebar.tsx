import { ClockIcon, EnvelopeClosedIcon, NotePencilIcon, PersonGavelIcon } from '@navikt/aksel-icons'
import { Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { useEffect } from 'react'
import styled from 'styled-components'

import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { HøyrekolonneTabs, StegType } from '../../types/types.internal'
import { SendBrevPanel } from '../høyrekolonne/brevutsending/SendBrevPanel'
import { SidebarPanel } from '../../sak/v2/sidebars/SidebarPanel'
import { Notater } from '../høyrekolonne/notat/Notater'
import { NotificationBadge } from '../høyrekolonne/notat/NotificationBadge'
import { useNotater } from '../høyrekolonne/notat/useNotater'
import { useBarnebrillesak } from '../useBarnebrillesak'
import { BarnebrillesakHistorikk } from './BarnebrillesakHistorikk'
import { useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { TotrinnskontrollPanel } from './steg/totrinnskontroll/TotrinnskontrollPanel'
import { ScrollContainer } from '../../felleskomponenter/ScrollContainer'

const Sidebar = styled(Tabs)`
  border-left: 1px solid var(--ax-border-neutral-subtle);
  min-height: 90vh;
  margin: 0;
  padding: 0;
`

export function BarnebrillesakSidebar() {
  const { sak } = useBarnebrillesak()
  const { valgtSidebarTab, setValgtSidebarTab } = useManuellSaksbehandlingContext()
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotater(sak?.data.sakId)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak)

  useEffect(() => {
    if (sak?.data.steg === StegType.GODKJENNE) {
      setValgtSidebarTab(HøyrekolonneTabs.TOTRINNSKONTROLL)
    }
  }, [])

  if (!sak) {
    return <></>
  }

  return (
    <Sidebar
      value={valgtSidebarTab}
      defaultValue={HøyrekolonneTabs.SAKSHISTORIKK}
      iconPosition="top"
      onChange={setValgtSidebarTab}
      loop
    >
      <Tabs.List>
        <Tooltip content="Historikk">
          <Tabs.Tab value={HøyrekolonneTabs.SAKSHISTORIKK} icon={<ClockIcon title="Historikk" />} />
        </Tooltip>
        <Tooltip content="Totrinnskontroll">
          <Tabs.Tab value={HøyrekolonneTabs.TOTRINNSKONTROLL} icon={<PersonGavelIcon title="Totrinnskontroll" />} />
        </Tooltip>
        <Tooltip content="Send brev">
          <Tabs.Tab value={HøyrekolonneTabs.SEND_BREV} icon={<EnvelopeClosedIcon title="Send brev" />} />
        </Tooltip>
        <Tooltip content="Notater">
          <Tabs.Tab
            value={HøyrekolonneTabs.NOTATER}
            icon={
              <>
                <NotePencilIcon title="Notat" />
                {!henterNotater && (
                  <Tag data-color="neutral" variant="moderate" size="xsmall" style={{ position: 'relative' }}>
                    {antallNotater}
                    {harUtkast && <NotificationBadge />}
                  </Tag>
                )}
              </>
            }
          />
        </Tooltip>
      </Tabs.List>
      <ScrollContainer>
        <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK}>
          <BarnebrillesakHistorikk />
        </Tabs.Panel>
        <Tabs.Panel value={HøyrekolonneTabs.TOTRINNSKONTROLL}>
          <TotrinnskontrollPanel />
        </Tabs.Panel>
        <Tabs.Panel value={HøyrekolonneTabs.SEND_BREV}>
          <SendBrevPanel sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
        </Tabs.Panel>
        <Tabs.Panel value={HøyrekolonneTabs.NOTATER}>
          <SidebarPanel tittel="Notater">
            <Notater sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
          </SidebarPanel>
        </Tabs.Panel>
      </ScrollContainer>
    </Sidebar>
  )
}
