import styled from 'styled-components'
import { HistorikkIkon } from '../../felleskomponenter/ikoner/HistorikkIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { SøknadslinjeProps } from '../Søknadslinje'
import { useSak } from '../sakHook'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversikt/hjelpemiddeloversiktHook'
import { Tabs } from '@navikt/ds-react'
import { hotsakHistorikkWidth } from '../../GlobalStyles'

export const HøyrekolonneHeader: React.FC<SøknadslinjeProps> = ({ onTabChange, currentTab }) => {
  const { sak } = useSak()
  const { hjelpemiddelArtikler, isError, isLoading } = useHjelpemiddeloversikt(
    sak?.data.personinformasjon.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => {
    return (antall += artikkel.antall)
  }, 0)

  return (
    <Tabs style={{ width: hotsakHistorikkWidth }}>
      <Tabs.List>
        <Tabs.Tab
          value={HøyrekolonneTabs.SAKSHISTORIKK}
          icon={<HistorikkIkon width={20} height={20} />}
          aria-selected={currentTab === HøyrekolonneTabs.SAKSHISTORIKK}
          onClick={() => onTabChange(HøyrekolonneTabs.SAKSHISTORIKK)}
        />
        <Tabs.Tab
          value={HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
          icon={
            <>
              <RullestolIkon width={20} height={20} title="Utlånsoversikt" />
              {!isLoading && !isError && <Teller>{antallUtlånteHjelpemidler}</Teller>}
            </>
          }
          aria-selected={currentTab === HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
          onClick={() => onTabChange(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT)}
        />
      </Tabs.List>
    </Tabs>
  )
}

const Teller = styled.div`
  background-color: var(--a-blue-500);
  color: var(--a-text-on-inverted);
  width: 24px;
  height: 24px;
  font-size: 14px;
  border-radius: 50%;
`
