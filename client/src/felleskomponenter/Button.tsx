import { ReactNode } from 'react'
import styled from 'styled-components'

export function Knappepanel({ children, gap }: { children: ReactNode; gap?: string }) {
  return <Container $gap={gap}>{children}</Container>
}

const Container = styled.div<{
  $gap?: string
}>`
  display: flex;
  justify-content: flex-start;
  gap: ${(props) => (props.$gap ? props.$gap : '1rem')};
  margin-top: var(--a-spacing-10);
`
