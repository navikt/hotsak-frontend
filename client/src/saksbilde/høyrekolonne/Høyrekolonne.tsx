import { ClockDashedIcon, NotePencilIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { Box, Tabs, Tag, Tooltip } from '@navikt/ds-react'

import { ScrollContainer } from '../../felleskomponenter/ScrollContainer.tsx'
import { søknadslinjeHøyde } from '../../GlobalStyles'
import { useSaksregler } from '../../saksregler/useSaksregler'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { useSak } from '../useSak'
import { useValgtFane } from '../useValgtFane.ts'
import { Historikk } from './historikk/Historikk'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { SidebarPanel } from '../../sak/v2/sidebars/SidebarPanel.tsx'
import { Notater } from './notat/Notater.tsx'
import { NotificationBadge } from './notat/NotificationBadge.tsx'
import { useNotater } from './notat/useNotater.tsx'
import { UtlånsoversiktV2 } from '../../sak/v2/sidebars/UtlånsoversiktV2.tsx'

export function Høyrekolonne() {
  const { kanBehandleSak } = useSaksregler()
  const { sak } = useSak()
  const { antallNotater, harUtkast, isLoading: henterNotater } = useNotater(sak?.data.sakId)
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )
  const [valgtFane, setValgtFane] = useValgtFane(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT)

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)

  return (
    <Box borderWidth="0 1" borderColor="neutral-subtle">
      <Tabs
        size="small"
        value={valgtFane}
        defaultValue={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
        onChange={setValgtFane}
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
                    <Tag data-color="neutral" variant="moderate" size="xsmall">
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
                        data-color="neutral"
                        variant="moderate"
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
          <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK}>
            <Historikk />
          </Tabs.Panel>
          <Tabs.Panel value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}>
            <Box paddingInline="space-16 space-16">
              <UtlånsoversiktV2 />
            </Box>
          </Tabs.Panel>
          {sak != null && (
            <Tabs.Panel value={HøyrekolonneTabs.NOTATER}>
              <SidebarPanel tittel="Notater">
                <Notater sakId={sak.data.sakId} lesevisning={!kanBehandleSak} />
              </SidebarPanel>
            </Tabs.Panel>
          )}
        </ScrollContainer>
      </Tabs>
    </Box>
  )
}
