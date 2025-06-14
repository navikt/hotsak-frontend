import { ClockDashedIcon, NotePencilIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { Box, Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { søknadslinjeHøyde } from '../../GlobalStyles'
import { useSaksregler } from '../../saksregler/useSaksregler'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { useSak } from '../useSak'
import { Historikk } from './historikk/Historikk'
import { Hjelpemiddeloversikt } from './hjelpemiddeloversikt/Hjelpemiddeloversikt'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { HøyrekolonnePanel } from './HøyrekolonnePanel.tsx'
import { Notater } from './notat/Notater.tsx'
import { NotificationBadge } from './notat/NotificationBadge.tsx'
import { useNotater } from './notat/useNotater.tsx'
import { ScrollContainer } from '../../felleskomponenter/ScrollContainer.tsx'

export function Høyrekolonne() {
  const [valgtHøyrekolonneTab, setValgtHøyrekolonneTab] = useState(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString())
  const { kanBehandleSak } = useSaksregler()
  const [searchParams, setSearchParams] = useSearchParams()
  const { sak } = useSak()
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotater(sak?.data.sakId)
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)
  const valgtSidebarParam = searchParams.get('valgttab')?.toUpperCase()

  useEffect(() => {
    const nyValgtTab = HøyrekolonneTabs[valgtSidebarParam as keyof typeof HøyrekolonneTabs]
    if (nyValgtTab && nyValgtTab !== valgtHøyrekolonneTab) {
      setValgtHøyrekolonneTab(nyValgtTab)
    }
  }, [valgtSidebarParam])

  useEffect(() => {
    setSearchParams({ valgttab: valgtHøyrekolonneTab })
  }, [valgtHøyrekolonneTab])

  return (
    <Box borderWidth="0 1" borderColor="border-subtle">
      <Tabs
        size="small"
        value={valgtHøyrekolonneTab}
        defaultValue={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}
        onChange={setValgtHøyrekolonneTab}
        loop
      >
        <Tabs.List style={{ height: `${søknadslinjeHøyde}` }}>
          <Tooltip content="Historikk">
            <Tabs.Tab value={HøyrekolonneTabs.SAKSHISTORIKK} icon={<ClockDashedIcon title="Sakshistorikk" />} />
          </Tooltip>
          <Tooltip content="Utlånsoversikt">
            <Tabs.Tab
              value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
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
          {sak != null && (
            <Tooltip content="Notater">
              <Tabs.Tab
                value={HøyrekolonneTabs.NOTATER}
                icon={
                  <>
                    <NotePencilIcon title="Notat" />
                    {!henterNotater && (
                      <Tag
                        variant="neutral-moderate"
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
          )}
        </Tabs.List>
        <ScrollContainer>
          <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK.toString()}>
            <Historikk />
          </Tabs.Panel>
          <Tabs.Panel value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
            <Hjelpemiddeloversikt />
          </Tabs.Panel>
          {sak != null && (
            <Tabs.Panel value={HøyrekolonneTabs.NOTATER.toString()}>
              <HøyrekolonnePanel tittel="Notater">
                <Notater sakId={sak.data.sakId} lesevisning={!kanBehandleSak} />
              </HøyrekolonnePanel>
            </Tabs.Panel>
          )}
        </ScrollContainer>
      </Tabs>
    </Box>
  )
}
