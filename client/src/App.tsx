import { ComponentType, lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { SWRConfig } from 'swr'

import { RequireAuth } from './RequireAuth'
import { DokumentProvider } from './dokument/DokumentContext'
import { Feilside } from './feilsider/Feilside'
import { GlobalFeilside } from './feilsider/GlobalFeilside'
import { Eksperiment } from './felleskomponenter/Eksperiment'
import { Toppmeny } from './header/Toppmeny'
import { FilterProvider } from './oppgavebenk/FilterContext'
import { PersonProvider } from './personoversikt/PersonContext'
import { useAuthentication } from './state/authentication'
import { amplitude_taxonomy, logAmplitudeEvent } from './utils/amplitude'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy'

const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste'))
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde'))
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt'))
const ManuellJournalføring = lazy(() => import('./journalføring/ManuellJournalføring'))
const Oppgavebenk = lazy(() => import('./oppgavebenk/Oppgavebenk'))
const Dokumentliste = lazy(() => import('./oppgaveliste/dokumenter/Dokumentliste'))

function App() {
  useAuthentication()
  logUserStats()
  const SaksTittelMedSaksnummerHjelper = () => (
    <Helmet title={`Hotsak - Sak ${useParams<{ saksnummer: string }>().saksnummer?.toString() || ''}`} />
  )
  return (
    <ErrorBoundary FallbackComponent={GlobalFeilside}>
      <PersonProvider>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Toppmeny />
          <Utviklingsverktøy />
          <ErrorBoundary FallbackComponent={GlobalFeilside}>
            <Suspense fallback={<div />}>
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
                        <Helmet title="Hotsak - Journalføringsliste" />
                        <Dokumentliste />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/oppgaveliste/dokumenter/:journalpostId"
                    element={
                      <RequireAuth>
                        <Helmet title="Hotsak - Journalføring" />
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
                        <SaksTittelMedSaksnummerHjelper />
                        <Saksbilde />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/personoversikt/*"
                    element={
                      <RequireAuth>
                        <Helmet title="Hotsak - Personoversikt" />
                        <Personoversikt />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/oppgavebenk"
                    element={
                      <RequireAuth>
                        <Helmet title="Hotsak - Oppgavebenk" />
                        <Eksperiment>
                          <FilterProvider>
                            <Oppgavebenk />
                          </FilterProvider>
                        </Eksperiment>
                      </RequireAuth>
                    }
                  />
                  <Route path="*" element={<Feilside statusCode={404} />} />
                </Routes>
              </main>
            </Suspense>
          </ErrorBoundary>
        </div>
      </PersonProvider>

      {/*<Toasts />*/}
    </ErrorBoundary>
  )
}

function logUserStats(): void {
  const { innerWidth: width, innerHeight: height } = window
  logAmplitudeEvent(amplitude_taxonomy.CLIENT_INFO, { res: { width, height } })
}

function withRoutingAndState(Component: ComponentType) {
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
