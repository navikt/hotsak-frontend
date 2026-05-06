import { ClockIcon, EnvelopeClosedIcon, NotePencilIcon, PersonGavelIcon } from '@navikt/aksel-icons'
import { Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { useEffect } from 'react'

import { ScrollContainer } from '../../felleskomponenter/ScrollContainer'
import { type Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { SidebarPanel } from '../../sak/v2/sidebars/SidebarPanel'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { HøyrekolonneTabs, StegType } from '../../types/types.internal'
import { SendBrevPanel } from '../høyrekolonne/brevutsending/SendBrevPanel'
import { Notater } from '../høyrekolonne/notat/Notater'
import { NotificationBadge } from '../høyrekolonne/notat/NotificationBadge'
import { useNotater } from '../høyrekolonne/notat/useNotater'
import { useBarnebrillesak } from '../useBarnebrillesak'
import { BarnebrillesakHistorikk } from './BarnebrillesakHistorikk'
import classes from './BarnebrillesakSidebar.module.css'
import { useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { TotrinnskontrollPanel } from './steg/totrinnskontroll/TotrinnskontrollPanel'

export function BarnebrillesakSidebar({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) {
  const { sak } = useBarnebrillesak()
  const { valgtSidebarTab, setValgtSidebarTab } = useManuellSaksbehandlingContext()
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotater(sak?.data.sakId)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak()

  useEffect(() => {
    if (sak?.data.steg === StegType.GODKJENNE) {
      setValgtSidebarTab(HøyrekolonneTabs.TOTRINNSKONTROLL)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!sak) {
    return <></>
  }

  return (
    <Tabs
      className={classes.sidebar}
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
          <SendBrevPanel oppgave={oppgave} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
        </Tabs.Panel>
        <Tabs.Panel value={HøyrekolonneTabs.NOTATER}>
          <SidebarPanel tittel="Notater">
            <Notater sakId={sak.data.sakId} lesevisning={!saksbehandlerKanRedigereBarnebrillesak} />
          </SidebarPanel>
        </Tabs.Panel>
      </ScrollContainer>
    </Tabs>
  )
}
