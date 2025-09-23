import { ComponentType, lazy, ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig, SWRConfiguration } from 'swr'

import { Theme } from '@navikt/ds-react'
import { Feilside } from './feilsider/Feilside.tsx'
import { GlobalFeilside } from './feilsider/GlobalFeilside.tsx'
import { ToastProvider } from './felleskomponenter/toast/ToastContext.tsx'
import { Toppmeny } from './header/Toppmeny.tsx'
import { useDarkmode } from './header/useDarkmode.ts'
import { http } from './io/HttpClient.ts'
import { OppgaveTitle } from './OppgaveTitle.tsx'
import { PersonProvider } from './personoversikt/PersonContext.tsx'
import { RequireAuth } from './RequireAuth.tsx'
import { SakTitle } from './SakTitle.tsx'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy.tsx'

const Journalføringsoppgaver = lazy(() => import('./journalføringsoppgaver/Journalføringsoppgaver.tsx'))
const Oppgave = lazy(() => import('./oppgave/Oppgave.tsx'))
const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste.tsx'))
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt.tsx'))
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde.tsx'))

function App() {
  const [darkmode] = useDarkmode()

  return (
    <Theme theme={darkmode ? 'dark' : 'light'}>
      <div
        style={{
          minHeight: '100vh',
          background: 'var(--ax-bg-default)',
          minWidth: '100vw',
          overflowX: 'auto',
          //width: hotsakMaxWidth,
        }}
      >
        <ErrorBoundary FallbackComponent={GlobalFeilside}>
          <PersonProvider>
            <ToastProvider>
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
                            <title>Hotsak - Journalføringsoppgaver</title>
                            <Journalføringsoppgaver />
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
                      <Route path="*" element={<Feilside statusCode={404} />} />
                    </Routes>
                  </main>
                </Suspense>
              </ErrorBoundary>
            </ToastProvider>
          </PersonProvider>
        </ErrorBoundary>
      </div>
    </Theme>
  )
}

function withRoutingAndState(Component: ComponentType): () => ReactNode {
  const swrConfig: SWRConfiguration = {
    async fetcher(...args) {
      return http.get(args[0])
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
