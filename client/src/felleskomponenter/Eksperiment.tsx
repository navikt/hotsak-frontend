import { useMemo, type ReactElement, type ReactNode } from 'react'

export interface EksperimentProps {
  children?: ReactNode
}

export function Eksperiment({ children }: EksperimentProps): ReactElement | null {
  const isProd = useIsProd()
  return isProd ? null : <>{children}</>
}

export function useIsProd(): boolean {
  return useMemo(() => window.appSettings.MILJO === 'prod-gcp', [])
}
