import { ClockDashedIcon, NotePencilIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { Box, Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { søknadslinjeHøyde } from '../../../../../GlobalStyles'
import { Historikk } from '../../../../../saksbilde/høyrekolonne/historikk/Historikk'
import { useHjelpemiddeloversikt } from '../../../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { HøyrekolonnePanel } from '../../../../../saksbilde/høyrekolonne/HøyrekolonnePanel'
import { Notater } from '../../../../../saksbilde/høyrekolonne/notat/Notater'
import { NotificationBadge } from '../../../../../saksbilde/høyrekolonne/notat/NotificationBadge'
import { useSak } from '../../../../../saksbilde/useSak'
import { useSaksregler } from '../../../../../saksregler/useSaksregler'
import { useSaksbehandlingEksperimentContext } from '../SaksbehandlingEksperimentProvider'
import { HøyrekolonneTabs, VenstrekolonneTabs } from '../SaksbehandlingEksperimentProviderTypes'
import { UtlånsoversiktEksperiment } from './UtlånsoversiktEksperiment'

export function NedreVenstrePanel() {
  const { valgtNedreVenstreKolonneTab, setValgtNedreVenstreKolonneTab } = useSaksbehandlingEksperimentContext()
  const { sak } = useSak()
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )
  const { kanBehandleSak } = useSaksregler()

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)

  return (
    <Box.New
      borderWidth="0 1"
      borderColor="neutral-subtle"
      background="default"
      borderRadius="large"
      style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <Tabs
        size="small"
        value={valgtNedreVenstreKolonneTab.toString()}
        onChange={(value) => setValgtNedreVenstreKolonneTab(value as VenstrekolonneTabs)}
        loop
        style={{ display: 'flex', height: '100%', flexDirection: 'column' }}
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
                    <Tag variant="neutral-moderate" size="xsmall">
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
                  <Tag
                    variant="neutral-moderate"
                    size="xsmall"
                    style={{ position: 'relative' }}
                    data-testid="notatteller"
                  >
                    2{true && <NotificationBadge data-testid="utkast-badge" />}
                  </Tag>
                </>
              }
            />
          </Tooltip>
        </Tabs.List>
        <div style={{ overflow: 'auto' }}>
          <Tabs.Panel value={VenstrekolonneTabs.SAKSHISTORIKK.toString()}>
            <Historikk />
          </Tabs.Panel>
          <Tabs.Panel value={VenstrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
            <UtlånsoversiktEksperiment />
          </Tabs.Panel>
          {sak != null && (
            <Tabs.Panel value={HøyrekolonneTabs.NOTATER.toString()}>
              <HøyrekolonnePanel tittel="Notater">
                <Notater sakId={sak.data.sakId} lesevisning={!kanBehandleSak} />
              </HøyrekolonnePanel>
            </Tabs.Panel>
          )}
        </div>
      </Tabs>
    </Box.New>
  )
}
