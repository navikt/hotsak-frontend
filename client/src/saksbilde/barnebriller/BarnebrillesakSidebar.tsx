import { useEffect } from 'react'
import styled from 'styled-components'

import { ClockIcon, EnvelopeClosedIcon, NotePencilIcon, PersonGavelIcon } from '@navikt/aksel-icons'
import { Tabs, Tag, Tooltip } from '@navikt/ds-react'

import { useSearchParams } from 'react-router'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { HøyrekolonneTabs, StegType } from '../../types/types.internal'
import { SendBrevPanel } from '../høyrekolonne/brevutsending/SendBrevPanel'
import { HøyrekolonnePanel } from '../høyrekolonne/HøyrekolonnePanel'
import { Notater } from '../høyrekolonne/notat/Notater'
import { NotificationBadge } from '../høyrekolonne/notat/NotificationBadge'
import { useNotater } from '../høyrekolonne/notat/useNotater'
import { useBarnebrillesak } from '../useBarnebrillesak'
import { BarnebrillesakHistorikk } from './BarnebrillesakHistorikk'
import { useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { TotrinnskontrollPanel } from './steg/totrinnskontroll/TotrinnskontrollPanel'

const Sidebar = styled(Tabs)`
  border-left: 1px solid var(--ax-border-neutral-subtle);
  //height: 90vh;
  margin: 0;
  padding: 0;
`

export function BarnebrillesakSidebar() {
  const { sak } = useBarnebrillesak()
  const { valgtSidebarTab, setValgtSidebarTab } = useManuellSaksbehandlingContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotater(sak?.data.sakId)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak)

  useEffect(() => {
    if (sak?.data.steg === StegType.GODKJENNE) {
      setValgtSidebarTab(HøyrekolonneTabs.TOTRINNSKONTROLL)
    }
  }, [])

  const valgtSidebarParam = searchParams.get('valgttab')?.toUpperCase()

  useEffect(() => {
    const nyValgtTab = HøyrekolonneTabs[valgtSidebarParam as keyof typeof HøyrekolonneTabs]
    if (nyValgtTab && nyValgtTab !== valgtSidebarTab) {
      setValgtSidebarTab(nyValgtTab)
    }
  }, [valgtSidebarParam])

  useEffect(() => {
    setSearchParams({ valgttab: valgtSidebarTab })
  }, [valgtSidebarTab])

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
      <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK.toString()}>
        <BarnebrillesakHistorikk />
      </Tabs.Panel>
      <Tabs.Panel value={HøyrekolonneTabs.TOTRINNSKONTROLL.toString()}>
        <TotrinnskontrollPanel />
      </Tabs.Panel>
      <Tabs.Panel value={HøyrekolonneTabs.SEND_BREV.toString()}>
        <SendBrevPanel sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
      </Tabs.Panel>
      <Tabs.Panel value={HøyrekolonneTabs.NOTATER.toString()}>
        <HøyrekolonnePanel tittel="Notater">
          <Notater sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
        </HøyrekolonnePanel>
      </Tabs.Panel>
    </Sidebar>
  )
}
