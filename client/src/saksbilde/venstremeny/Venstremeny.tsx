import styled from 'styled-components/macro'

const Container = styled.section`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: var(--speil-venstremeny-width);
  min-width: 19.5rem;
  padding: 2rem 1.5rem;
  border-right: 1px solid var(--navds-color-border);
`

export const VenstreMeny: React.FC = ({ children }) => {
  return <Container>{children}</Container>
}
