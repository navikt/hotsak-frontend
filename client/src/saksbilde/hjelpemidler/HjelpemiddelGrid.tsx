import { HGrid } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export function HjelpemiddelGrid(props: { className?: string; children: ReactNode }) {
  const { children } = props
  return (
    <HGrid columns="auto 3rem 5rem" align="start" gap="space-16">
      {children}
    </HGrid>
  )
}
