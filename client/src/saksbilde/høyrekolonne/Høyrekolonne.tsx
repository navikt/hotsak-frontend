import { ClockDashedIcon, DocPencilIcon, WheelchairIcon } from '@navikt/aksel-icons'

import { Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { useState } from 'react'
import { søknadslinjeHøyde } from '../../GlobalStyles'
import { useSaksregler } from '../../saksregler/useSaksregler'
import { useErNotatPilot } from '../../state/authentication'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { useSak } from '../useSak'
import { Historikk } from './historikk/Historikk'
import { Hjelpemiddeloversikt } from './hjelpemiddeloversikt/Hjelpemiddeloversikt'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { Saksnotater } from './notat/Saksnotater'
import { useSaksnotater } from './notat/useSaksnotater'

export function Høyrekolonne() {
  const [valgtHøyrekolonneTab, setValgtHøyrekolonneTab] = useState(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString())
  const { kanBehandleSak } = useSaksregler()
  const { sak } = useSak()
  const { notater } = useSaksnotater(sak?.data.sakId)
  const erNotatPilot = useErNotatPilot()
  const { hjelpemiddelArtikler, error, isLoading } = useHjelpemiddeloversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  const antallNotater = notater?.length
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
                    <Tag variant="neutral-moderate" size="xsmall">
                      {antallUtlånteHjelpemidler}
                    </Tag>
                  )}
                </>
              }
            />
          </Tooltip>
          {erNotatPilot && (
            <Tooltip content="Notat">
              <Tabs.Tab
                value={HøyrekolonneTabs.NOTAT}
                icon={
                  <>
                    <DocPencilIcon title="Notat" />
                    {notater && (
                      <Tag variant="neutral-moderate" size="xsmall">
                        {antallNotater}
                      </Tag>
                    )}
                  </>
                }
              />
            </Tooltip>
          )}
        </Tabs.List>
        <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK.toString()}>
          <Historikk />
        </Tabs.Panel>
        <Tabs.Panel value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
          <Hjelpemiddeloversikt />
        </Tabs.Panel>
        {erNotatPilot && (
          <Tabs.Panel value={HøyrekolonneTabs.NOTAT.toString()}>
            <Saksnotater sakId={sak?.data.sakId} lesevisning={!kanBehandleSak} />
          </Tabs.Panel>
        )}
      </Tabs>
    </div>
  )
}
