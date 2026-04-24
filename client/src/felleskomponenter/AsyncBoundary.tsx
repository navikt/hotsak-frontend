import { type ComponentType, type ReactNode, Suspense } from 'react'
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary'
import { Feilmelding } from './feil/Feilmelding.tsx'

export interface AsyncBoundaryProps {
  name?: string
  errorComponent?: ComponentType<FallbackProps>
  suspenseFallback?: ReactNode
  children: ReactNode
}

export function AsyncBoundary(props: AsyncBoundaryProps) {
  const { name = 'AsyncBoundary', errorComponent = Feilmelding, suspenseFallback = null, children } = props
  return (
    <ErrorBoundary FallbackComponent={errorComponent}>
      <Suspense name={name} fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
