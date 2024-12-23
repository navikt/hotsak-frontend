import { HGrid } from '@navikt/ds-react'
import type { ReactNode } from 'react'

export function HjelpemiddelGrid(props: { className?: string; children: ReactNode }) {
  const { /*className,*/ children } = props
  return (
    <HGrid columns={'2.75rem auto'} align="start" gap="3" /*className={className}*/>
      {children}
    </HGrid>
  )
}
