import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import { sorterKronologisk } from '../utils/dato'
import { AlertError } from '../feilsider/AlertError'
import { Feilmelding } from '../felleskomponenter/Feilmelding'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { LasterPersonlinje, Personlinje } from '../saksbilde/Personlinje'
import { useHjelpemiddeloversikt } from '../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import HjelpemiddeloversiktTabell from './HjelpemiddeloversiktTabell'
import { usePersonContext } from './PersonContext'
import Saksoversikt from './Saksoversikt'
import { SaksoversiktLinje } from './SaksoversiktLinje'
import { usePerson } from './usePerson'
import { useSaksoversikt } from './saksoversiktHook'
import { Avstand } from '../felleskomponenter/Avstand'

const PersonoversiktContent: React.FC = () => {
  const { fodselsnummer } = usePersonContext()
  const { personInfo, isLoading: personInfoLoading, isError: personInfoError } = usePerson(fodselsnummer)
  const { saksoversikt, isLoading, isError } = useSaksoversikt(fodselsnummer)
  const {
    hjelpemiddelArtikler,
    isError: hjelpemiddeloversiktError,
    isLoading: hjelpemiddeloversiktLoading,
  } = useHjelpemiddeloversikt(fodselsnummer)

  if (personInfoError) {
    if (personInfoError.statusCode === 403) {
      return <Feilmelding>Du har ikke tilgang til å se informasjon om denne brukeren</Feilmelding>
    } else if (personInfoError.statusCode === 404) {
      return <Feilmelding>Person ikke funnet i PDL</Feilmelding>
    } else {
      return <Feilmelding>Teknisk feil. Klarte ikke å hente person fra PDL.</Feilmelding>
    }
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

const LasterPersonoversikt: React.FC = () => {
  return (
    <>
      <LasterPersonlinje />
    </>
  )
}

const Personoversikt: React.FC = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterPersonlinje />}>
      <PersonoversiktContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default Personoversikt
