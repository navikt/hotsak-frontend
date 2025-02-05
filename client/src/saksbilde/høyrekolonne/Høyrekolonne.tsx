import { ClockDashedIcon, DocPencilIcon, WheelchairIcon } from '@navikt/aksel-icons'

import { Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { useState } from 'react'
import { søknadslinjeHøyde } from '../../GlobalStyles'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { useSak } from '../useSak'
import { Historikk } from './historikk/Historikk'
import { Hjelpemiddeloversikt } from './hjelpemiddeloversikt/Hjelpemiddeloversikt'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { Eksperiment } from '../../felleskomponenter/Eksperiment'
import { Saksnotater } from './notat/Saksnotater'
import { useSaksregler } from '../../saksregler/useSaksregler'

export function Høyrekolonne() {
  const [valgtHøyrekolonneTab, setValgtHøyrekolonneTab] = useState(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString())
  const { kanBehandleSak } = useSaksregler()
  const { sak } = useSak()
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => antall + artikkel.antall, 0)

  return (
    <div style={{ borderLeft: '1px solid var(--a-border-subtle)', borderRight: '1px solid var(--a-border-subtle)' }}>
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
                    <Tag variant="alt3-moderate" size="small">
                      {antallUtlånteHjelpemidler}
                    </Tag>
                  )}
                </>
              }
            />
          </Tooltip>
          <Tooltip content="Notat">
            <Tabs.Tab value={HøyrekolonneTabs.NOTAT} icon={<DocPencilIcon title="Notat" />} />
          </Tooltip>
        </Tabs.List>
        <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK.toString()}>
          <Historikk />
        </Tabs.Panel>
        <Tabs.Panel value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
          <Hjelpemiddeloversikt />
        </Tabs.Panel>
        <Eksperiment>
          <Tabs.Panel value={HøyrekolonneTabs.NOTAT.toString()}>
            <Saksnotater sakId={sak?.data.sakId} lesevisning={!kanBehandleSak} />
          </Tabs.Panel>
        </Eksperiment>
      </Tabs>
    </div>
  )
}
