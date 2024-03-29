import React, { useState } from 'react'
import styled from 'styled-components'

import { Tabs, Tag, Tooltip } from '@navikt/ds-react'
import { søknadslinjeHøyde } from '../../GlobalStyles'
import { HistorikkIkon } from '../../felleskomponenter/ikoner/HistorikkIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { useSak } from '../sakHook'
import { Historikk } from './historikk/Historikk'
import { Hjelpemiddeloversikt } from './hjelpemiddeloversikt/Hjelpemiddeloversikt'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversikt/hjelpemiddeloversiktHook'

export const KolonneOppsett = styled.ul`
  margin: 0;
  flex: 1;
  flex-shrink: 0;
  padding: 0 24px;
  box-sizing: border-box;
`

export const KolonneTittel = styled.li`
  margin-top: 16px;
  font-size: 14px;
`

export const Høyrekolonne: React.FC = () => {
  const [valgtHøyrekolonneTab, setValgtHøyrekolonneTab] = useState(HøyrekolonneTabs.SAKSHISTORIKK.toString())
  const { sak } = useSak()
  const { hjelpemiddelArtikler, isError, isLoading } = useHjelpemiddeloversikt(
    sak?.data.personinformasjon.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => {
    return (antall += artikkel.antall)
  }, 0)

  return (
    <aside style={{ borderLeft: '1px solid var(--a-border-subtle)' }}>
      <Tabs
        defaultValue={HøyrekolonneTabs.SAKSHISTORIKK.toString()}
        value={valgtHøyrekolonneTab}
        loop
        onChange={setValgtHøyrekolonneTab}
        size="small"
      >
        <Tabs.List style={{ height: `${søknadslinjeHøyde}` }}>
          <Tooltip content="Historikk">
            <Tabs.Tab value={HøyrekolonneTabs.SAKSHISTORIKK} icon={<HistorikkIkon width={20} height={20} />} />
          </Tooltip>
          <Tooltip content="Utlånsoversikt">
            <Tabs.Tab
              value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
              icon={
                <>
                  <RullestolIkon width={20} height={20} title="Utlånsoversikt" />
                  {!isLoading && !isError && (
                    <Tag variant="alt3-moderate" size="small">
                      {antallUtlånteHjelpemidler}
                    </Tag>
                  )}
                </>
              }
            />
          </Tooltip>
        </Tabs.List>
        <Tabs.Panel value={HøyrekolonneTabs.SAKSHISTORIKK.toString()}>
          <Historikk />
        </Tabs.Panel>
        <Tabs.Panel value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT.toString()}>
          <Hjelpemiddeloversikt />
        </Tabs.Panel>
      </Tabs>
    </aside>
  )
}
