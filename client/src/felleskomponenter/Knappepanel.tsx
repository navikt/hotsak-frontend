import { ReactNode } from 'react'
import styled from 'styled-components'

export function Knappepanel({ children, gap, spacing }: { children: ReactNode; gap?: string; spacing?: number }) {
  return (
    <Container $gap={gap} $spacing={spacing ? spacing : 6}>
      {children}
    </Container>
  )
}

const Container = styled.div<{
  $gap?: string
  $spacing: number
}>`
  display: flex;
  justify-content: flex-start;
  gap: ${(props) => (props.$gap ? props.$gap : 'var(--a-spacing-2)')};
  margin-top: var(--a-spacing-${(props) => props.$spacing});
`
