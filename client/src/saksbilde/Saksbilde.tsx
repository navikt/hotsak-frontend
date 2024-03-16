import React from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { DokumentProvider } from '../oppgaveliste/dokumenter/DokumentContext'

import { AlertError } from '../feilsider/AlertError'
import { Sakstype } from '../types/types.internal'
import { Personlinje } from './Personlinje'
import Søknadsbilde from './Søknadsbilde'
import BarnebrilleBilde from './barnebriller/Barnebrillebilde'
import Bestillingsbilde from './bestillingsordning/Bestillingsbilde'
import { SaksLoader } from './loader/SaksLoader'
import { useSak } from './sakHook'

export const SaksbildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`

const SaksbildeContent = React.memo(() => {
  const { sak, isLoading, isError } = useSak()
  const { showBoundary } = useErrorBoundary()

  if (isLoading) return <SaksLoader />

  if (isError) {
    showBoundary(isError)
  }

  if (!sak?.data) return <div>Fant ikke sak</div>

  return (
    <>
      <SaksbildeContainer>
        <Personlinje person={sak.data.bruker} loading={false} />
        {(() => {
          switch (sak.data.sakstype) {
            case Sakstype.BESTILLING:
              return <Bestillingsbilde />
            case Sakstype.BARNEBRILLER:
              return (
                <DokumentProvider>
                  <BarnebrilleBilde />
                </DokumentProvider>
              )
            default:
              return <Søknadsbilde />
          }
        })()}
      </SaksbildeContainer>
    </>
  )
})

export const Saksbilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<SaksLoader />}>
      <SaksbildeContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Saksbilde
