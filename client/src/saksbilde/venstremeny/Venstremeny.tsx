import styled from 'styled-components/macro'
import { hotsaktVenstremenyWidth } from '../../GlobalStyles'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: ${hotsaktVenstremenyWidth};
  min-width: 19.5rem;
  padding: 2rem 1.5rem;
  border-right: 1px solid var(--navds-semantic-color-border-muted);
`

export const VenstreMeny: React.FC = ({ children }) => {
  return <Container>{children}</Container>
}
