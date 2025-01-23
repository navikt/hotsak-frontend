import { HGrid } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export function HjelpemiddelGrid(props: { className?: string; children: ReactNode }) {
  const { children } = props
  return (
    <HGrid columns="auto 3rem" align="start" gap="4">
      {children}
    </HGrid>
  )
}
