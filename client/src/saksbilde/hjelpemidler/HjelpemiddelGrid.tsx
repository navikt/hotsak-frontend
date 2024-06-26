import { HGrid } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export function HjelpemiddelGrid(props: { className?: string; children: ReactNode }) {
  const { className, children } = props
  return (
    <HGrid columns={{ xs: '70px auto', xl: '140px auto' }} gap="3" className={className}>
      {children}
    </HGrid>
  )
}
