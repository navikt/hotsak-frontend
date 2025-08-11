import { ComponentType, lazy, ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useParams } from 'react-router'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig, SWRConfiguration } from 'swr'

import { RequireAuth } from './RequireAuth'
import { DokumentProvider } from './dokument/DokumentContext'
import { Feilside } from './feilsider/Feilside'
import { GlobalFeilside } from './feilsider/GlobalFeilside'
import { Eksperiment } from './felleskomponenter/Eksperiment'
import { Toppmeny } from './header/Toppmeny'
import { FilterProvider } from './oppgavebenk/FilterContext'
import { PersonProvider } from './personoversikt/PersonContext'
import { initUmami } from './sporing/umami.ts'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { OppgaveProvider } from './oppgave/OppgaveProvider.tsx'

const Dokumentliste = lazy(() => import('./oppgaveliste/dokumenter/Dokumentliste'))
const ManuellJournalføring = lazy(() => import('./journalføring/ManuellJournalføring'))
const Oppgavebenk = lazy(() => import('./oppgavebenk/Oppgavebenk'))
const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste'))
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt'))
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde'))

function App() {
  initUmami()
  const SakTitle = () => (
    <title>{`Hotsak - Sak ${useParams<{ saksnummer: string }>().saksnummer?.toString() || ''}`}</title>
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
                        <title>Hotsak - Journalføringsliste</title>
                        <Dokumentliste />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/oppgaveliste/dokumenter/:journalpostId"
                    element={
                      <RequireAuth>
                        <title>Hotsak - Journalføring</title>
                        <OppgaveProvider>
                          <DokumentProvider>
                            <ManuellJournalføring />
                          </DokumentProvider>
                        </OppgaveProvider>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/sak/:saksnummer/*"
                    element={
                      <RequireAuth>
                        <SakTitle />
                        <OppgaveProvider>
                          <Saksbilde />
                        </OppgaveProvider>
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/personoversikt/*"
                    element={
                      <RequireAuth>
                        <title>Hotsak - Personoversikt</title>
                        <Personoversikt />
                      </RequireAuth>
                    }
                  />

                  <Route
                    path="/oppgavebenk"
                    element={
                      <RequireAuth>
                        <title>Hotsak - Oppgavebenk</title>
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

function withRoutingAndState(Component: ComponentType): () => ReactNode {
  const swrConfig: SWRConfiguration = {
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
      try {
        const contentType = response.headers.get('Content-Type') ?? ''
        if (contentType.startsWith('application/json')) {
          return Promise.reject(await response.json())
        } else {
          return Promise.reject(await response.text())
        }
      } catch (e: unknown) {
        return Promise.reject(e)
      }
    },
  }

  return () => (
    <BrowserRouter>
      <SWRConfig value={swrConfig}>
        <TilgangProvider>
          <Component />
        </TilgangProvider>
      </SWRConfig>
    </BrowserRouter>
  )
}

export default withRoutingAndState(App)
