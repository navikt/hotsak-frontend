import { ComponentType, lazy, ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig, SWRConfiguration } from 'swr'

import { Feilside } from './feilsider/Feilside.tsx'
import { GlobalFeilside } from './feilsider/GlobalFeilside.tsx'
import { Toppmeny } from './header/Toppmeny.tsx'
import { http } from './io/HttpClient.ts'
import { OppgaveTitle } from './OppgaveTitle.tsx'
import { PersonProvider } from './personoversikt/PersonContext.tsx'
import { RequireAuth } from './RequireAuth.tsx'
import { SakTitle } from './SakTitle.tsx'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy.tsx'
import { Theme } from '@navikt/ds-react'
import { useDarkmode } from './header/useDarkmode.ts'
import { ToastProvider } from './felleskomponenter/toast/Toast.tsx'

const Journalføringsoppgaver = lazy(() => import('./journalføringsoppgaver/Journalføringsoppgaver.tsx'))
const Oppgave = lazy(() => import('./oppgave/Oppgave.tsx'))
const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste.tsx'))
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt.tsx'))
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde.tsx'))

function App() {
  const [darkmode] = useDarkmode()
  return (
    <Theme theme={darkmode ? 'dark' : 'light'}>
      <ErrorBoundary FallbackComponent={GlobalFeilside}>
        <PersonProvider>
          <ToastProvider>
            {/* TODO Se på layout her, denne diven er kanskje ikke nødvendig lenger */}
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
            </div>
          </ToastProvider>
        </PersonProvider>
      </ErrorBoundary>
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
