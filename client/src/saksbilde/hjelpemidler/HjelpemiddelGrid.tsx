import styled from 'styled-components'
import { HGrid } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export function HjelpemiddelGrid(props: { children: ReactNode }) {
  const { children } = props
  return (
    <HGrid columns={{ xs: '70px auto', xl: '140px auto' }} gap="3">
      {children}
    </HGrid>
  )
}

export const Fremhev = styled.div`
  border-right: 0.1875rem solid var(--a-border-info);
`
