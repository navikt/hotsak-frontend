import { ClockDashedIcon, NotePencilIcon, WheelchairIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Box, Button, Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { søknadslinjeHøyde } from '../../../../GlobalStyles'
import { Historikk } from '../../../../saksbilde/høyrekolonne/historikk/Historikk'
import { useHjelpemiddeloversikt } from '../../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { SidebarPanel } from '../SidebarPanel'
import { Notater } from '../../../../saksbilde/høyrekolonne/notat/Notater'
import { NotificationBadge } from '../../../../saksbilde/høyrekolonne/notat/NotificationBadge'
import { useNotater } from '../../../../saksbilde/høyrekolonne/notat/useNotater'
import { useSak } from '../../../../saksbilde/useSak'
import { useSaksregler } from '../../../../saksregler/useSaksregler'
import { HøyrekolonneTabs, VenstrekolonneTabs } from '../../SakPanelTabTypes'
import { UtlånsoversiktV2 } from './UtlånsoversiktV2'
import { useSaksbehandlingEksperimentContext } from '../../SakProvider'

export function VenstreSidebar() {
  const { valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab, setSidePanel } =
    useSaksbehandlingEksperimentContext()
  const { sak } = useSak()
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )
  const { kanBehandleSak } = useSaksregler()
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotater(sak?.data.sakId)
  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)

  return (
    <Box.New
      borderWidth="0 1"
      borderColor="neutral-subtle"
      background="default"
      height="100%"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Button
        variant="tertiary-neutral"
        size="small"
        icon={<XMarkIcon title="a11y-title" fontSize="1.5rem" />}
        onClick={() => setSidePanel(false)}
        style={{
          /* FIXME: Trolig ikke måten vi bør gjøre dette på, men har ikke tid til noe annet */ position: 'absolute',
          right: '0.5em',
          top: '0.5rem',
        }}
      />
      <Tabs
        style={{ height: '100%' }}
        size="small"
        value={valgtNedreVenstreKolonneTab.toString()}
        onChange={(value) => setValgtNedreVenstreKolonneTab(value as VenstrekolonneTabs)}
        loop
      >
        <Tabs.List style={{ height: `${søknadslinjeHøyde}` }}>
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
        <div style={{ overflowY: 'auto', scrollbarGutter: 'stable both-edges', height: '100%' }}>
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
        </div>
      </Tabs>
    </Box.New>
  )
}
