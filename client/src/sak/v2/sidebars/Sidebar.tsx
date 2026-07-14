import { ClockDashedIcon, WheelchairIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Box, Button, Tabs, Tag, Tooltip } from '@navikt/ds-react'

import { ScrollablePanel } from '../../../felleskomponenter/ScrollablePanel'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { Historikk } from '../../../saksbilde/høyrekolonne/historikk/Historikk'
import { useUtlånoversikt } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useUtlånoversikt'
import { useSak } from '../../../saksbilde/useSak'
import { Notater } from '../../notat/Notater'
import { NotaterIconLegacy } from '../../notat/NotaterIcon'
import { useClosePanel } from '../paneler/usePanelHooks'
import { HøyrekolonneTabs, VenstrekolonneTabs } from '../SakPanelTabTypes'
import { useSakContext } from '../SakV2ContextType'
import classes from './Sidebar.module.css'
import { SidebarPanel } from './SidebarPanel'
import { UtlånsoversiktV2 } from './UtlånsoversiktV2'
import { Mellomtittel } from '../../../felleskomponenter/typografi'

export interface SidebarProps {
  oppgave?: Saksbehandlingsoppgave
}

export function Sidebar({ oppgave }: SidebarProps) {
  const { valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab } = useSakContext()
  const { sak } = useSak()
  const { antallUtlånteHjelpemidler, error, isLoading } = useUtlånoversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )
  const closePanel = useClosePanel('sidebarpanel')

  return (
    <Box background="default" height="100%" position="relative" paddingBlock="space-0 space-36">
      <Button
        data-color="neutral"
        variant="tertiary"
        size="small"
        icon={<XMarkIcon title={`Lukk sidepanel`} fontSize="20px" />}
        onClick={closePanel}
        className={classes.closeButton}
      />
      <Tabs
        className={classes.tabs}
        size="small"
        value={valgtNedreVenstreKolonneTab.toString()}
        onChange={(value) => setValgtNedreVenstreKolonneTab(value as VenstrekolonneTabs)}
        loop
      >
        <Tabs.List>
          <Tooltip content="Historikk">
            <Tabs.Tab value={VenstrekolonneTabs.SAKSHISTORIKK} icon={<ClockDashedIcon title="Sakshistorikk" />} />
          </Tooltip>
          <Tooltip content="Utlånsoversikt">
            <Tabs.Tab
              value={VenstrekolonneTabs.HJELPEMIDDELOVERSIKT}
              icon={
                <>
                  <WheelchairIcon title="Utlånsoversikt" />
                  {!isLoading && !error && (
                    <Tag
                      variant={`${antallUtlånteHjelpemidler > 0 ? 'info-moderate' : 'neutral-moderate'}`}
                      size="xsmall"
                    >
                      {antallUtlånteHjelpemidler}
                    </Tag>
                  )}
                </>
              }
            />
          </Tooltip>
          <Tooltip content="Notater">
            <Tabs.Tab
              value={HøyrekolonneTabs.NOTATER}
              icon={<NotaterIconLegacy oppgaveId={oppgave?.oppgaveId} sakId={sak?.data.sakId} />}
            />
          </Tooltip>
        </Tabs.List>
        <ScrollablePanel aria-label="Sidepanel">
          <Tabs.Panel value={VenstrekolonneTabs.SAKSHISTORIKK.toString()}>
            <Historikk />
          </Tabs.Panel>
          <Tabs.Panel value={VenstrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
            <UtlånsoversiktV2 />
          </Tabs.Panel>
          {sak != null && (
            <Tabs.Panel value={HøyrekolonneTabs.NOTATER.toString()}>
              <SidebarPanel tittel={<Mellomtittel>Notater</Mellomtittel>}>
                <Notater oppgave={oppgave} />
              </SidebarPanel>
            </Tabs.Panel>
          )}
        </ScrollablePanel>
      </Tabs>
    </Box>
  )
}
