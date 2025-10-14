import {
  ClockDashedIcon,
  FileIcon,
  FolderFileIcon,
  InformationIcon,
  InformationSquareIcon,
  WheelchairIcon,
} from '@navikt/aksel-icons'
import { Box, Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { ScrollContainer } from '../../../../../felleskomponenter/ScrollContainer'
import { søknadslinjeHøyde } from '../../../../../GlobalStyles'
import { Historikk } from '../../../../../saksbilde/høyrekolonne/historikk/Historikk'
import { Hjelpemiddeloversikt } from '../../../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/Hjelpemiddeloversikt'
import { useHjelpemiddeloversikt } from '../../../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { useSak } from '../../../../../saksbilde/useSak'
import { Søknadsinfo } from '../../../../../saksbilde/venstremeny/Søknadsinfo'

export function InfokolonneEksperiment() {
  const [valgtTab, setValgtTab] = useState(TabTyper.HJELPEMIDDELOVERSIKT.toString())
  const [searchParams, setSearchParams] = useSearchParams()
  const { sak } = useSak()
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)
  const valgtSidebarParam = searchParams.get('valgttab')?.toUpperCase()

  useEffect(() => {
    const nyValgtTab = TabTyper[valgtSidebarParam as keyof typeof TabTyper]
    if (nyValgtTab && nyValgtTab !== valgtTab) {
      setValgtTab(nyValgtTab)
    }
  }, [valgtSidebarParam])

  useEffect(() => {
    setSearchParams({ valgttab: valgtTab })
  }, [valgtTab])

  return (
    <Box.New borderWidth="0 1" borderColor="neutral-subtle">
      <Tabs
        size="small"
        value={valgtTab}
        defaultValue={TabTyper.HJELPEMIDDELOVERSIKT.toString()}
        onChange={setValgtTab}
        loop
      >
        <Tabs.List style={{ height: `${søknadslinjeHøyde}` }}>
          <Tooltip content="Behovsmeldingsinfo">
            <Tabs.Tab value={TabTyper.BEHOVSMELDINGSINFO} icon={<InformationSquareIcon title="Behovsmeldingsinfo" />} />
          </Tooltip>
          <Tooltip content="Saksoversikt">
            <Tabs.Tab value={TabTyper.SAKSOVERSIKT} icon={<FolderFileIcon title="Saksoversikt" />} />
          </Tooltip>
          <Tooltip content="Dokumentoversikt">
            <Tabs.Tab value={TabTyper.DOKUMENTOVERSIKT} icon={<FileIcon title="Dokumentoversikt" />} />
          </Tooltip>
          <Tooltip content="Historikk">
            <Tabs.Tab value={TabTyper.SAKSHISTORIKK} icon={<ClockDashedIcon title="Sakshistorikk" />} />
          </Tooltip>
          <Tooltip content="Utlånsoversikt">
            <Tabs.Tab
              value={TabTyper.HJELPEMIDDELOVERSIKT}
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
        </Tabs.List>
        <ScrollContainer>
          <Tabs.Panel value={TabTyper.BEHOVSMELDINGSINFO.toString()}>
            <Box padding="space-16">
              <Søknadsinfo />
            </Box>
          </Tabs.Panel>
          <Tabs.Panel value={TabTyper.SAKSOVERSIKT.toString()}>TODO</Tabs.Panel>
          <Tabs.Panel value={TabTyper.DOKUMENTOVERSIKT.toString()}>TODO</Tabs.Panel>
          <Tabs.Panel value={TabTyper.SAKSHISTORIKK.toString()}>
            <Historikk />
          </Tabs.Panel>
          <Tabs.Panel value={TabTyper.HJELPEMIDDELOVERSIKT.toString()}>
            <Hjelpemiddeloversikt />
          </Tabs.Panel>
        </ScrollContainer>
      </Tabs>
    </Box.New>
  )
}

enum TabTyper {
  BEHOVSMELDINGSINFO = 'BEHOVSMELDINGSINFO',
  SAKSOVERSIKT = 'SAKSOVERSIKT',
  DOKUMENTOVERSIKT = 'DOKUMENTOVERSIKT',
  SAKSHISTORIKK = 'SAKSHISTORIKK',
  HJELPEMIDDELOVERSIKT = 'HJELPEMIDDELOVERSIKT',
}
