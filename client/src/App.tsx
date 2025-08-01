import { ComponentType, lazy, ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig, SWRConfiguration } from 'swr'

import { Feilside } from './feilsider/Feilside'
import { GlobalFeilside } from './feilsider/GlobalFeilside'
import { Eksperiment } from './felleskomponenter/Eksperiment'
import { Toppmeny } from './header/Toppmeny'
import { FilterProvider } from './oppgavebenk/FilterContext'
import { OppgaveTitle } from './OppgaveTitle.tsx'
import { PersonProvider } from './personoversikt/PersonContext'
import { RequireAuth } from './RequireAuth'
import { SakTitle } from './SakTitle.tsx'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy'

const Dokumentliste = lazy(() => import('./oppgaveliste/dokumenter/Dokumentliste.tsx'))
const Oppgave = lazy(() => import('./oppgave/Oppgave.tsx'))
const Oppgavebenk = lazy(() => import('./oppgavebenk/Oppgavebenk.tsx'))
const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste.tsx'))
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt.tsx'))
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde.tsx'))

function App() {
  return (
    <ErrorBoundary FallbackComponent={GlobalFeilside}>
      <PersonProvider>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Toppmeny />
          <Utviklingsverktøy />
          <ErrorBoundary FallbackComponent={GlobalFeilside}>
            <Suspense fallback={<div />}>
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
                    path="/journalforing"
                    element={
                      <RequireAuth>
                        <title>Hotsak - Journalføringsliste</title>
                        <Dokumentliste />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/sak/:sakId/*"
                    element={
                      <RequireAuth>
                        <SakTitle />
                        <Saksbilde />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/oppgave/:oppgaveId/*"
                    element={
                      <RequireAuth>
                        <OppgaveTitle />
                        <Oppgave />
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
                        <title>Hotsak - Oppgaver</title>
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
