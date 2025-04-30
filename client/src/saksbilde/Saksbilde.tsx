import { memo, Suspense } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

import { DokumentProvider } from '../dokument/DokumentContext'
import { AlertError } from '../feilsider/AlertError'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { usePerson } from '../personoversikt/usePerson'
import { Sakstype } from '../types/types.internal'
import { Barnebrillesaksbilde } from './barnebriller/Barnebrillesaksbilde'
import { Personlinje } from './Personlinje'
import { SakLoader } from './SakLoader'
import { Søknadsbilde } from './Søknadsbilde'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'

const SaksbildeContent = memo(() => {
  const { sak, isLoading, isError } = useSak()
  const { isLoading: isBehovsmeldingLoading, isError: isBehovsmeldingError } = useBehovsmelding()
  const { showBoundary } = useErrorBoundary()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePerson(sak?.data.bruker.fnr)

  if (isLoading || personInfoLoading || isBehovsmeldingLoading) return <SakLoader />

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  if (isError) {
    showBoundary(isError)
  }

  if (isBehovsmeldingError) {
    showBoundary(isBehovsmeldingError)
  }

  if (!sak?.data) return <div>Fant ikke sak</div>

  return (
    <>
      <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
      {(() => {
        switch (sak.data.sakstype as Sakstype) {
          case Sakstype.BARNEBRILLER:
            return (
              <DokumentProvider>
                <Barnebrillesaksbilde />
              </DokumentProvider>
            )
          case Sakstype.BESTILLING:
          default:
            return (
              <DokumentProvider>
                <Søknadsbilde />
              </DokumentProvider>
            )
        }
      })()}
    </>
  )
})

export default function Saksbilde() {
  return (
    <ErrorBoundary FallbackComponent={AlertError}>
      <Suspense fallback={<SakLoader />}>
        <SaksbildeContent />
      </Suspense>
    </ErrorBoundary>
  )
}
