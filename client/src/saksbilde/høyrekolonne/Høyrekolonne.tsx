import { ClockDashedIcon, WheelchairIcon } from '@navikt/aksel-icons'
import { Box, Tabs, Tag, Tooltip } from '@navikt/ds-react'

import { ScrollContainer } from '../../felleskomponenter/ScrollContainer.tsx'
import type { Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { Notater } from '../../sak/notat/Notater.tsx'
import { NotaterIcon } from '../../sak/notat/NotaterIcon.tsx'
import { SidebarPanel } from '../../sak/v2/sidebars/SidebarPanel.tsx'
import { UtlånsoversiktV2 } from '../../sak/v2/sidebars/UtlånsoversiktV2.tsx'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { useSak } from '../useSak'
import { useValgtFane } from '../useValgtFane.ts'
import { Historikk } from './historikk/Historikk'
import { useUtlånoversikt } from './hjelpemiddeloversikt/useUtlånoversikt.ts'
import classes from './Høyrekolonne.module.css'

export interface HøyrekolonneProps {
  oppgave?: Saksbehandlingsoppgave
}

export function Høyrekolonne({ oppgave }: HøyrekolonneProps) {
  const { sak } = useSak()
  const { antallUtlånteHjelpemidler, error, isLoading } = useUtlånoversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )
  const [valgtFane, setValgtFane] = useValgtFane(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT)

  return (
    <Box borderWidth="0 1" borderColor="neutral-subtle">
      <Tabs
        size="small"
        value={valgtFane}
        defaultValue={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
        onChange={setValgtFane}
        loop
      >
        <Tabs.List className={classes.tabsList}>
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
                icon={<NotaterIcon oppgaveId={oppgave?.oppgaveId} sakId={sak.data.sakId} />}
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
                <Notater oppgave={oppgave} />
              </SidebarPanel>
            </Tabs.Panel>
          )}
        </ScrollContainer>
      </Tabs>
    </Box>
  )
}
