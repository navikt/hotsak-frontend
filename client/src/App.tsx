import { Theme } from '@navikt/ds-react'
import { type ComponentType, lazy, type ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import { SWRConfig, type SWRConfiguration } from 'swr'

import classes from './App.module.css'
import { Feilside } from './feilsider/Feilside.tsx'
import { GlobalFeilside } from './feilsider/GlobalFeilside.tsx'
import { ToastProvider } from './felleskomponenter/toast/ToastContext.tsx'
import { Toppmeny } from './header/Toppmeny.tsx'
import { useDarkmode } from './header/useDarkmode.ts'
import { http } from './io/HttpClient.ts'
import { PersonProvider } from './personoversikt/PersonContext.tsx'
import { RequireAuth } from './RequireAuth.tsx'
import { useLogBruker } from './sporing/useLogBruker.ts'
import { useLogVinduStørrelse } from './sporing/useLogVinduStørrelse.ts'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { useInnloggetAnsatt } from './tilgang/useTilgang.ts'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy.tsx'

// fixme -> fiks eslint-feil
// eslint-disable-next-line react-refresh/only-export-components
const Oppgave = lazy(() => import('./oppgave/Oppgave.tsx'))
// fixme -> fiks eslint-feil
// eslint-disable-next-line react-refresh/only-export-components
const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste.tsx'))
// fixme -> fiks eslint-feil
// eslint-disable-next-line react-refresh/only-export-components
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt.tsx'))
// fixme -> fiks eslint-feil
// eslint-disable-next-line react-refresh/only-export-components
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde.tsx'))

// fixme -> fiks eslint-feil
// eslint-disable-next-line react-refresh/only-export-components
function App() {
  const [darkmode] = useDarkmode()

  useLogBruker()
  useLogVinduStørrelse()

  const { id } = useInnloggetAnsatt()
  if (!id) {
    return null
  }

  return (
    <Theme theme={darkmode ? 'dark' : 'light'}>
      <div className={classes.root}>
        <ErrorBoundary FallbackComponent={GlobalFeilside}>
          <PersonProvider>
            <ToastProvider>
              <Toppmeny />
              <Utviklingsverktøy />
              <ErrorBoundary FallbackComponent={GlobalFeilside}>
                <Suspense fallback={<div />}>
                  <Routes>
                    <Route path="/uautorisert" element={<Feilside statusCode={401} />} />
                    {/* Ruter hvor paneler kan scrolles uavhengig og ingen global scroll */}
                    <Route element={<PanelLayout />}>
                      <Route
                        path="/sak/:sakId/*"
                        element={
                          <RequireAuth>
                            <Saksbilde />
                          </RequireAuth>
                        }
                      />
                      <Route
                        path="/oppgave/:oppgaveId/*"
                        element={
                          <RequireAuth>
                            <Oppgave />
                          </RequireAuth>
                        }
                      />
                    </Route>

                    {/* Ruter hvor det er naturlig med global vertikal scroll */}
                    <Route element={<SideLayout />}>
                      <Route
                        path="/*"
                        element={
                          <RequireAuth>
                            <Oppgaveliste />
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
                    </Route>
                    <Route path="*" element={<Feilside statusCode={404} />} />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </ToastProvider>
          </PersonProvider>
        </ErrorBoundary>
      </div>
    </Theme>
  )
}

// TODO slå sammen PanelLayout og ScrollableLayout til en komponent som tar inn en prop for om den skal være scrollable eller ikke, så slipper vi å duplisere Outlet og Routes
// fixme -> fiks eslint-feil
// eslint-disable-next-line react-refresh/only-export-components
function PanelLayout() {
  return (
    <main className={classes.panelLayout}>
      <Outlet />
    </main>
  )
}

// fixme -> fiks eslint-feil
// eslint-disable-next-line react-refresh/only-export-components
function SideLayout() {
  return (
    <main className={classes.sideLayout}>
      <Outlet />
    </main>
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
