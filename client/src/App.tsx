import { Box, LocalAlert, Theme } from '@navikt/ds-react'
import { type ComponentType, lazy, type ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig, type SWRConfiguration } from 'swr'

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
import { useLogVinduStørrelse } from './sporing/useLogVinduStørrelse.ts'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy.tsx'

import classes from './App.module.css'
import { TextContainer } from './felleskomponenter/typografi.tsx'
import { useNyttSaksbilde } from './sak/v2/useNyttSaksbilde.ts'

import { useLogBruker } from './sporing/useLogBruker.ts'

const Journalføringsoppgaver = lazy(() => import('./journalføringsoppgaver/Journalføringsoppgaver.tsx'))
const Oppgave = lazy(() => import('./oppgave/Oppgave.tsx'))
const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste.tsx'))
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt.tsx'))
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde.tsx'))

function App() {
  const [darkmode] = useDarkmode()
  const [nyttSaksbilde] = useNyttSaksbilde()

  useLogBruker()
  useLogVinduStørrelse()

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
                  <main>
                    <Routes>
                      <Route path="/uautorisert" element={<Feilside statusCode={401} />} />
                      <Route
                        path="/*"
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
                            {nyttSaksbilde ? (
                              <Box padding="space-20">
                                <TextContainer>
                                  <LocalAlert status="warning">
                                    <LocalAlert.Header>
                                      <LocalAlert.Title>TODO </LocalAlert.Title>
                                    </LocalAlert.Header>
                                    <LocalAlert.Content>
                                      TODO: Hvordan skal vi vise en Hotsak1.5 sak når vi ikke er i context av en
                                      oppgave?
                                    </LocalAlert.Content>
                                  </LocalAlert>
                                </TextContainer>
                              </Box>
                            ) : (
                              <Saksbilde />
                            )}
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
