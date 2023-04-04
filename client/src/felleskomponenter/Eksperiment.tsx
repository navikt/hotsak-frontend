import type { ReactElement, ReactNode } from 'react'

export interface EksperimentProps {
  children?: ReactNode
}

export function Eksperiment({ children }: EksperimentProps): ReactElement | null {
  return window.appSettings.MILJO === 'prod-gcp' ? null : <>{children}</>
}
