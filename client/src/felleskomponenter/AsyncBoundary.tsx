import { ComponentType, type ReactNode, Suspense } from 'react'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'

import { GlobalFeilside } from '../feilsider/GlobalFeilside.tsx'

export interface AsyncBoundaryProps {
  name?: string
  errorComponent?: ComponentType<FallbackProps>
  suspenseFallback?: ReactNode
  children: ReactNode
}

export function AsyncBoundary(props: AsyncBoundaryProps) {
  const { name = 'AsyncBoundary', errorComponent = GlobalFeilside, suspenseFallback = null, children } = props
  return (
    <ErrorBoundary FallbackComponent={errorComponent}>
      <Suspense name={name} fallback={suspenseFallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}
