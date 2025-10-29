import { ClockDashedIcon, InformationSquareIcon } from '@navikt/aksel-icons'
import { Box, Tabs, Tooltip } from '@navikt/ds-react'
import { søknadslinjeHøyde } from '../../../../../GlobalStyles'
import { Historikk } from '../../../../../saksbilde/høyrekolonne/historikk/Historikk'
import { useSaksbehandlingEksperimentContext } from '../SaksbehandlingEksperimentProvider'
import { VenstrekolonneTabs } from '../SaksbehandlingEksperimentProviderTypes'
import { SøknadsinfoEksperiment } from './SøknadsinfoEksperiment'

export function ØvreVenstrePanel() {
  const { valgtØvreVenstreKolonneTab, setValgtØvreVenstreKolonneTab } = useSaksbehandlingEksperimentContext()

  return (
    <Box.New background="default" borderRadius="large" style={{ overflow: 'auto' }}>
      <Tabs
        size="small"
        value={valgtØvreVenstreKolonneTab.toString()}
        onChange={(value) => setValgtØvreVenstreKolonneTab(value as VenstrekolonneTabs)}
        loop
      >
        <Tabs.List style={{ height: `${søknadslinjeHøyde}` }}>
          <Tooltip content="Behovsmeldingsinfo">
            <Tabs.Tab
              value={VenstrekolonneTabs.BEHOVSMELDINGSINFO}
              icon={<InformationSquareIcon title="Behovsmeldingsinfo" />}
            />
          </Tooltip>
          <Tooltip content="Historikk">
            <Tabs.Tab value={VenstrekolonneTabs.SAKSHISTORIKK} icon={<ClockDashedIcon title="Sakshistorikk" />} />
          </Tooltip>
        </Tabs.List>

        <Tabs.Panel value={VenstrekolonneTabs.BEHOVSMELDINGSINFO.toString()}>
          <Box padding="space-16">
            <SøknadsinfoEksperiment />
          </Box>
        </Tabs.Panel>
        <Tabs.Panel value={VenstrekolonneTabs.SAKSHISTORIKK.toString()}>
          <Historikk />
        </Tabs.Panel>
      </Tabs>
    </Box.New>
  )
}
