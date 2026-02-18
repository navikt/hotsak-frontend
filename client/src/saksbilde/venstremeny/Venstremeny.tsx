import { VStack, VStackProps } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import styled from 'styled-components'

export interface VenstremenyProps {
  gap?: VStackProps['gap']
  children: ReactNode
}

export function Venstremeny({ gap, children }: VenstremenyProps) {
  return (
    <Container forwardedAs="aside" padding="space-16" gap={gap}>
      {children}
    </Container>
  )
}

const Container = styled(VStack)`
  border-right: 1px solid var(--ax-border-neutral-subtle);
`
