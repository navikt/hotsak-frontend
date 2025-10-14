import { ClockDashedIcon, FileIcon, FolderFileIcon, InformationSquareIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { Box, Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { ScrollContainer } from '../../../../../felleskomponenter/ScrollContainer'
import { søknadslinjeHøyde } from '../../../../../GlobalStyles'
import { Historikk } from '../../../../../saksbilde/høyrekolonne/historikk/Historikk'
import { Hjelpemiddeloversikt } from '../../../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/Hjelpemiddeloversikt'
import { useHjelpemiddeloversikt } from '../../../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { useSak } from '../../../../../saksbilde/useSak'
import { Søknadsinfo } from '../../../../../saksbilde/venstremeny/Søknadsinfo'
import { useSaksbehandlingEksperimentContext } from '../SaksbehandlingEksperimentProvider'
import { VenstrekolonneTabs } from '../SaksbehandlingEksperimentProviderTypes'

export function InfokolonneEksperiment() {
  const { valgtVenstreKolonneTab, setValgtVenstreKolonneTab } = useSaksbehandlingEksperimentContext()
  const { sak } = useSak()
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)

  return (
    <Box.New borderWidth="0 1" borderColor="neutral-subtle">
      <Tabs
        size="small"
        value={valgtVenstreKolonneTab.toString()}
        onChange={(value) => setValgtVenstreKolonneTab(value as VenstrekolonneTabs)}
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
          <Tooltip content="Saksoversikt">
            <Tabs.Tab value={VenstrekolonneTabs.SAKSOVERSIKT} icon={<FolderFileIcon title="Saksoversikt" />} />
          </Tooltip>

          <Tooltip content="Dokumentoversikt">
            <Tabs.Tab value={VenstrekolonneTabs.DOKUMENTOVERSIKT} icon={<FileIcon title="Dokumentoversikt" />} />
          </Tooltip>
        </Tabs.List>
        <ScrollContainer>
          <Tabs.Panel value={VenstrekolonneTabs.BEHOVSMELDINGSINFO.toString()}>
            <Box padding="space-16">
              <Søknadsinfo />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value={VenstrekolonneTabs.SAKSOVERSIKT.toString()}>TODO</Tabs.Panel>
          <Tabs.Panel value={VenstrekolonneTabs.DOKUMENTOVERSIKT.toString()}>TODO</Tabs.Panel>
          <Tabs.Panel value={VenstrekolonneTabs.SAKSHISTORIKK.toString()}>
            <Historikk />
          </Tabs.Panel>
          <Tabs.Panel value={VenstrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
            <Hjelpemiddeloversikt />
          </Tabs.Panel>
        </ScrollContainer>
      </Tabs>
    </Box.New>
  )
}
