import { ErrorBoundary } from 'react-error-boundary'
import { Route } from 'react-router'
import { Routes } from 'react-router-dom'
import { Suspense } from 'react'

import { sorterKronologisk } from '../utils/dato'
import { AlertError } from '../feilsider/AlertError'
import { Feilmelding } from '../felleskomponenter/feil/Feilmelding'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { LasterPersonlinje, Personlinje } from '../saksbilde/Personlinje'
import { useHjelpemiddeloversikt } from '../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { HjelpemiddeloversiktTabell } from './HjelpemiddeloversiktTabell'
import { usePersonContext } from './PersonContext'
import { Saksoversikt } from './Saksoversikt'
import { SaksoversiktLinje } from './SaksoversiktLinje'
import { usePerson } from './usePerson'
import { useSaksoversikt } from './saksoversiktHook'
import { Avstand } from '../felleskomponenter/Avstand'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Helmet } from 'react-helmet'
import { formaterNavn } from '../utils/formater.ts'

function PersonoversiktContent() {
  const { fodselsnummer } = usePersonContext()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePerson(fodselsnummer)
  const { saksoversikt, isLoading, isError } = useSaksoversikt(fodselsnummer)
  const {
    hjelpemiddelArtikler,
    error: hjelpemiddeloversiktError,
    isLoading: hjelpemiddeloversiktLoading,
  } = useHjelpemiddeloversikt(fodselsnummer)

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  const hotsakSaker = saksoversikt?.hotsakSaker.sort((a, b) => sorterKronologisk(a.mottattDato, b.mottattDato)) || []
  const barnebrilleSaker = saksoversikt?.barnebrilleSaker?.sort((a, b) =>
    sorterKronologisk(a.sak.mottattDato, b.sak.mottattDato)
  )
  const hjelpemidler = hjelpemiddelArtikler?.sort((a, b) => sorterKronologisk(a.datoUtsendelse, b.datoUtsendelse)) || []
  const antallUtlånteHjelpemidler = hjelpemidler?.reduce((antall, artikkel) => {
    return (antall += artikkel.antall)
  }, 0)

  return (
    <>
      <Helmet title={`HOTSAK - Personoversikt ${formaterNavn(personInfo)}`} />
      <Skjermlesertittel>Personoversikt</Skjermlesertittel>
      {personInfoLoading ? (
        <LasterPersonoversikt />
      ) : (
        <>
          <Personlinje loading={personInfoLoading} person={personInfo} />
          <SaksoversiktLinje
            sakerCount={hotsakSaker.length + (barnebrilleSaker?.length || 0)}
            hjelpemidlerCount={antallUtlånteHjelpemidler}
          />
          <Avstand paddingTop={4} paddingLeft={8} paddingRight={8}>
            <Routes>
              <Route
                path="/saker"
                element={
                  isError ? (
                    <Feilmelding>Teknisk feil ved henting av saksoversikt</Feilmelding>
                  ) : (
                    <Saksoversikt
                      hotsakSaker={hotsakSaker}
                      barnebrilleSaker={barnebrilleSaker}
                      henterSaker={isLoading}
                    />
                  )
                }
              />
              <Route
                path="/hjelpemidler"
                element={
                  hjelpemiddeloversiktError ? (
                    <Feilmelding>Teknisk feil ved henting av utlånsoversikt</Feilmelding>
                  ) : (
                    <HjelpemiddeloversiktTabell
                      artikler={hjelpemidler}
                      henterHjelpemiddeloversikt={hjelpemiddeloversiktLoading}
                    />
                  )
                }
              />
            </Routes>
          </Avstand>
        </>
      )}
    </>
  )
}

function LasterPersonoversikt() {
  return (
    <>
      <LasterPersonlinje />
    </>
  )
}

function Personoversikt() {
  return (
    <ErrorBoundary FallbackComponent={AlertError}>
      <Suspense fallback={<LasterPersonlinje />}>
        <PersonoversiktContent />
      </Suspense>
    </ErrorBoundary>
  )
}

export default Personoversikt
