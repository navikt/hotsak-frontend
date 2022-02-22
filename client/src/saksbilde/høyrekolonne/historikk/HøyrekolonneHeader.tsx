import styled from 'styled-components/macro'
import { HistorikkIkon } from '../../../felleskomponenter/ikoner/HistorikkIkon'
import { RullestolIkon } from '../../../felleskomponenter/ikoner/RullestolIkon'
import { HøyrekolonneTabs } from '../../../types/types.internal'
import { useSak } from '../../sakHook'
import { SøknadslinjeProps } from '../../Søknadslinje'
import { TabButton } from '../../TabButton'
import { useHjelpemiddeloversikt } from '../hjelpemiddeloversikt/hjelpemiddeloversiktHook'

const Header = styled.section`
  display: flex;
  height: 48px;
  box-sizing: border-box;
  width: var(--speil-historikk-width);
`
const Teller = styled.div`
    background-color: var(--navds-global-color-blue-500);
    color: var(--navds-semantic-color-text-inverted);
    min-width: 24px;
    min-height: 24px;
    font-size:14px;
    position: absolute;
    padding:4px;
    top: 5px;
    left: 35px;
    border-radius: 50%;
`

export const HøyrekolonneHeader = ({ onTabChange, currentTab }: SøknadslinjeProps) => {
    const { sak } = useSak()
    const { hjelpemiddelArtikler, isError, isLoading}  = useHjelpemiddeloversikt(sak?.personinformasjon.fnr)

    const antallUtlånteHjelpemidler = hjelpemiddelArtikler?.reduce((antall, artikkel) => {
        return antall += artikkel.antall

    }, 0)
  return (
    <Header>
      <TabButton
        active={currentTab === HøyrekolonneTabs.SAKSHISTORIKK}
        onClick={() => onTabChange(HøyrekolonneTabs.SAKSHISTORIKK)}
      >
        <HistorikkIkon width={20} height={20} />
      </TabButton>
      <TabButton
        active={currentTab === HøyrekolonneTabs.HJELPEMIDDELOVERSIKT}
        onClick={() => onTabChange(HøyrekolonneTabs.HJELPEMIDDELOVERSIKT)}
      >
          {(!isLoading && !isError) && <Teller>{antallUtlånteHjelpemidler}</Teller>}
        <RullestolIkon width={20} height={20} />
      </TabButton>
    </Header>
  )
}
