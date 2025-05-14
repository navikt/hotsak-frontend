import { type ReactElement, type ReactNode } from 'react'

import { useMiljø } from '../utils/useMiljø.ts'

export interface EksperimentProps {
  children?: ReactNode
}

export function Eksperiment({ children }: EksperimentProps): ReactElement | null {
  const { erProd } = useMiljø()
  return erProd ? null : <>{children}</>
}
