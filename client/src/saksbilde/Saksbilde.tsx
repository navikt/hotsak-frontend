import React from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { DokumentProvider } from '../dokument/DokumentContext'

import { AlertError } from '../feilsider/AlertError'
import { Sakstype } from '../types/types.internal'
import { Personlinje } from './Personlinje'
import { Søknadsbilde } from './Søknadsbilde'
import { Barnebrillesaksbilde } from './barnebriller/Barnebrillesaksbilde'
import { SakLoader } from './SakLoader'
import { useSak } from './useSak'

export const SaksbildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`

const SaksbildeContent = React.memo(() => {
  const { sak, isLoading, isError } = useSak()
  const { showBoundary } = useErrorBoundary()

  if (isLoading) return <SakLoader />

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
            case Sakstype.BARNEBRILLER:
              return (
                <DokumentProvider>
                  <Barnebrillesaksbilde />
                </DokumentProvider>
              )
            case Sakstype.BESTILLING:
            default:
              return <Søknadsbilde />
          }
        })()}
      </SaksbildeContainer>
    </>
  )
})

export default function Saksbilde() {
  return (
    <ErrorBoundary FallbackComponent={AlertError}>
      <React.Suspense fallback={<SakLoader />}>
        <SaksbildeContent />
      </React.Suspense>
    </ErrorBoundary>
  )
}
