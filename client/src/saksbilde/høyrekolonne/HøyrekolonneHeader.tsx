import styled from 'styled-components/macro'

import { hotsakHistorikkWidth } from '../../GlobalStyles'
import { HistorikkIkon } from '../../felleskomponenter/ikoner/HistorikkIkon'
import { RullestolIkon } from '../../felleskomponenter/ikoner/RullestolIkon'
import { HøyrekolonneTabs } from '../../types/types.internal'
import { SøknadslinjeProps } from '../Søknadslinje'
import { TabButton } from '../TabButton'
import { useSak } from '../sakHook'
import { useHjelpemiddeloversikt } from './hjelpemiddeloversikt/hjelpemiddeloversiktHook'

const Header = styled.div`
  display: flex;
  height: 48px;
  box-sizing: border-box;
  width: ${hotsakHistorikkWidth};
`

const Teller = styled.div`
  background-color: var(--navds-global-color-blue-500);
  color: var(--navds-semantic-color-text-inverted);
  min-width: 24px;
  min-height: 24px;
  font-size: 14px;
  position: absolute;
  padding: 4px;
  top: 5px;
  left: 35px;
  border-radius: 50%;
`

export const HøyrekolonneHeader: React.VFC<SøknadslinjeProps> = ({ onTabChange, currentTab }) => {
  const { sak } = useSak()
  const { hjelpemiddelArtikler, isError, isLoading } = useHjelpemiddeloversikt(
    sak?.personinformasjon.fnr,
    sak?.vedtak?.vedtaksgrunnlag
  )

  const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => {
    return (antall += artikkel.antall)
  }, 0)
  return (
    <Header role="tablist">
      <TabButton
        role="tab"
        aria-selected={currentTab === HøyrekolonneTabs.SAKSHISTORIKK}
        active={currentTab === HøyrekolonneTabs.SAKSHISTORIKK}
        onClick={() => onTabChange(HøyrekolonneTabs.SAKSHISTORIKK)}
      >
        <HistorikkIkon width={20} height={20} />
      </TabButton>
      <TabButton
        role="tab"
        aria-selected={currentTab === HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
        active={currentTab === HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
        onClick={() => onTabChange(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT)}
      >
        {!isLoading && !isError && <Teller>{antallUtlånteHjelpemidler}</Teller>}
        <RullestolIkon width={20} height={20} title="Utlånsoversikt" />
      </TabButton>
    </Header>
  )
}
