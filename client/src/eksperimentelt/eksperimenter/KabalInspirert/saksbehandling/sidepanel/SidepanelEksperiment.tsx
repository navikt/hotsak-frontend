import { ClockDashedIcon, NotePencilIcon, WheelchairIcon, XMarkIcon } from '@navikt/aksel-icons'
import { Box, Button, Tabs, Tag, Tooltip } from '@navikt/ds-react'
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
import { useNotater } from '../../../../../saksbilde/høyrekolonne/notat/useNotater'

export function SidepanelEksperiment() {
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
      borderRadius="large"
      style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
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
