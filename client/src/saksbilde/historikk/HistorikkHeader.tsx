import styled from 'styled-components/macro'

//import { HistorikkIkon } from '../../felleskomponenter/ikoner/HistorikkIkon'
//import { TabButton } from '../TabButton'

const Header = styled.section`
  display: flex;
  justify-content: flex-end;
  height: 48px;
  box-sizing: border-box;
`
/*const HistorikkTabButton = styled(TabButton)`
  height: 48px;
  width: 48px,
`*/

export const HistorikkHeader: React.FC = ({ children }) => {
  return <Header>{/*<HistorikkTabButton active={true}>
          <HistorikkIkon />
  </HistorikkTabButton>*/}</Header>
}
