import React from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import styled from 'styled-components/macro'

import { AlertError } from '../feilsider/AlertError'
import { Oppgavetype } from '../types/types.internal'
import { LasterPersonlinje } from './Personlinje'
import Søknadsbilde from './Søknadsbilde'
import Bestillingsbilde from './bestillingsordning/Bestillingsbilde'
import { useSak } from './sakHook'

const SaksbildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`

const SaksbildeContent: React.VFC = React.memo(() => {
  const { sak, isLoading, isError } = useSak()
  const handleError = useErrorHandler()

  if (isLoading) return <LasterSaksbilde />

  if (isError) {
    handleError(isError)
  }

  if (!sak) return <div>Fant ikke sak</div>

  if (sak.sakstype === Oppgavetype.BESTILLING) {
    return <Bestillingsbilde />
  } else {
    return <Søknadsbilde />
  }
})

export const Saksbilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterSaksbilde />}>
      <SaksbildeContent />
    </React.Suspense>
  </ErrorBoundary>
)

const LasterSaksbilde = () => (
  <SaksbildeContainer className="saksbilde" data-testid="laster-saksbilde">
    <LasterPersonlinje />
  </SaksbildeContainer>
)

export default Saksbilde
