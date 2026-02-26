import { ClockDashedIcon, NotePencilIcon, WheelchairIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Box, Button, Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { ScrollablePanel } from '../../../felleskomponenter/ScrollablePanel'
import { Historikk } from '../../../saksbilde/høyrekolonne/historikk/Historikk'
import { useHjelpemiddeloversikt } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { Notater } from '../../../saksbilde/høyrekolonne/notat/Notater'
import { NotificationBadge } from '../../../saksbilde/høyrekolonne/notat/NotificationBadge'
import { useNotater } from '../../../saksbilde/høyrekolonne/notat/useNotater'
import { useSak } from '../../../saksbilde/useSak'
import { useSaksregler } from '../../../saksregler/useSaksregler'
import { useClosePanel } from '../paneler/usePanelHooks'
import { HøyrekolonneTabs, VenstrekolonneTabs } from '../SakPanelTabTypes'
import { useSakContext } from '../SakProvider'
import { SidebarPanel } from './SidebarPanel'
import { UtlånsoversiktV2 } from './UtlånsoversiktV2'

export function Sidebar() {
  const { valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab } = useSakContext()
  const { sak } = useSak()
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )
  const { kanBehandleSak } = useSaksregler()
  const closePanel = useClosePanel('sidebarpanel')
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotater(sak?.data.sakId)
  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)

  return (
    <Box background="default" height="100%" position="relative">
      <Button
        data-color="neutral"
        variant="tertiary"
        size="small"
        icon={<XMarkIcon title={`Lukk sidepanel`} fontSize="20px" />}
        onClick={closePanel}
        style={{
          /* FIXME: Trolig ikke måten vi bør gjøre dette på, men har ikke tid til noe annet */ position: 'absolute',
          right: '0.3rem',
        }}
      />
      <Tabs
        style={{ height: '100%' }}
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
              icon={
                <>
                  <NotePencilIcon title="Notat" />
                  {!henterNotater && (
                    <Tag
                      variant={`${antallNotater > 0 ? 'info-moderate' : 'neutral-moderate'}`}
                      size="xsmall"
                      style={{ position: 'relative' }}
                      data-testid="notatteller"
                    >
                      {antallNotater}
                      {harUtkast && <NotificationBadge data-testid="utkast-badge" />}
                    </Tag>
                  )}
                </>
              }
            />
          </Tooltip>
        </Tabs.List>
        <ScrollablePanel>
          <Tabs.Panel value={VenstrekolonneTabs.SAKSHISTORIKK.toString()}>
            <Historikk />
          </Tabs.Panel>
          <Tabs.Panel value={VenstrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
            <UtlånsoversiktV2 />
          </Tabs.Panel>
          {sak != null && (
            <Tabs.Panel value={HøyrekolonneTabs.NOTATER.toString()}>
              <SidebarPanel tittel="Notater">
                <Notater sakId={sak.data.sakId} lesevisning={!kanBehandleSak} />
              </SidebarPanel>
            </Tabs.Panel>
          )}
        </ScrollablePanel>
      </Tabs>
    </Box>
  )
}
