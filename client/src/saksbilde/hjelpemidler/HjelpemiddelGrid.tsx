import styled from 'styled-components'
import { Bleed, HGrid } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export function HjelpemiddelGrid(props: { className?: string; children: ReactNode }) {
  const { className, children } = props
  return (
    <HGrid columns={{ xs: '70px auto', xl: '140px auto' }} gap="3" className={className}>
      {children}
    </HGrid>
  )
}

export const Fremhev = styled.div`
  border-right: 0.1875rem solid var(--a-border-info);
`

export function Fremhev2(props: { children: ReactNode }) {
  const { children } = props
  return <Bleed>{children}</Bleed>
}
