import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'

import { DokumentProvider } from './oppgaveliste/dokumenter/DokumentContext'
import Dokumentliste from './oppgaveliste/dokumenter/Dokumentliste'
import { ManuellJournalfør } from './oppgaveliste/manuellJournalføring/ManuellJournalføring'
import { amplitude_taxonomy, logAmplitudeEvent } from './utils/amplitude'

import { RequireAuth } from './RequireAuth'
import { Feilside } from './feilsider/Feilside'
import { GlobalFeilside } from './feilsider/GlobalFeilside'
import { Toppmeny } from './header/Header'
import { PersonProvider } from './personoversikt/PersonContext'
import { useAuthentication } from './state/authentication'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy'

const Oppgaveliste = React.lazy(() => import('./oppgaveliste/Oppgaveliste'))
const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde'))
const Personoversikt = React.lazy(() => import('./personoversikt/Personoversikt'))

function App() {
  useAuthentication()
  logUserStats()
  return (
    <ErrorBoundary FallbackComponent={GlobalFeilside}>
      <PersonProvider>
        <Toppmeny />
        <Utviklingsverktøy />
        <ErrorBoundary FallbackComponent={GlobalFeilside}>
          <React.Suspense fallback={<div />}>
            {/*<Varsler />*/}
            <main>
              <Routes>
                <Route path="/uautorisert" element={<Feilside statusCode={401} />} />
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <Oppgaveliste />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/oppgaveliste/dokumenter"
                  element={
                    <RequireAuth>
                      <Dokumentliste />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/oppgaveliste/dokumenter/:journalpostID"
                  element={
                    <RequireAuth>
                      <DokumentProvider>
                        <ManuellJournalfør />
                      </DokumentProvider>
                    </RequireAuth>
                  }
                />
                <Route
                  path="/sak/:saksnummer/*"
                  element={
                    <RequireAuth>
                      <Saksbilde />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/personoversikt/*"
                  element={
                    <RequireAuth>
                      <Personoversikt />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<Feilside statusCode={404} />} />
              </Routes>
            </main>
          </React.Suspense>
        </ErrorBoundary>
      </PersonProvider>
      {/*<Toasts />*/}
    </ErrorBoundary>
  )
}

function logUserStats(): void {
  const { innerWidth: width, innerHeight: height } = window
  logAmplitudeEvent(amplitude_taxonomy.CLIENT_INFO, { res: { width, height } })
}

function withRoutingAndState(Component: React.ComponentType) {
  return (): JSX.Element => (
    <BrowserRouter>
      <SWRConfig
        value={{
          async fetcher(...args) {
            const response = await fetch(args[0])
            if (response.ok) {
              return response.json()
            }
            return Promise.reject('noe gikk galt')
          },
        }}
      >
        <RecoilRoot>
          <Component />
        </RecoilRoot>
      </SWRConfig>
    </BrowserRouter>
  )
}

export default withRoutingAndState(App)
