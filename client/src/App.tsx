import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'

import { DokumentProvider } from './dokument/DokumentContext'
import { Dokumentliste } from './oppgaveliste/dokumenter/Dokumentliste'
import { ManuellJournalføring } from './journalføring/ManuellJournalføring'
import { amplitude_taxonomy, logAmplitudeEvent } from './utils/amplitude'

import { RequireAuth } from './RequireAuth'
import { Feilside } from './feilsider/Feilside'
import { GlobalFeilside } from './feilsider/GlobalFeilside'
import { Toppmeny } from './header/Header'
import { PersonProvider } from './personoversikt/PersonContext'
import { useAuthentication } from './state/authentication'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy'
import { Eksperiment } from './felleskomponenter/Eksperiment'
import { Oppgavebenk } from './oppgavebenk/Oppgavebenk'

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
                        <ManuellJournalføring />
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

                <Route
                  path="/oppgavebenk"
                  element={
                    <RequireAuth>
                      <Eksperiment>
                        <Oppgavebenk />
                      </Eksperiment>
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
            const response = await fetch(args[0], {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
              },
            })
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
