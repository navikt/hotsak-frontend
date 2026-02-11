import { Box, LocalAlert, Theme, VStack } from '@navikt/ds-react'
import { type ComponentType, lazy, type ReactNode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SWRConfig, type SWRConfiguration } from 'swr'

import { Feilside } from './feilsider/Feilside.tsx'
import { GlobalFeilside } from './feilsider/GlobalFeilside.tsx'
import { ToastProvider } from './felleskomponenter/toast/ToastContext.tsx'

import { TextContainer } from './felleskomponenter/typografi.tsx'
import { Toppmeny } from './header/Toppmeny.tsx'
import { useDarkmode } from './header/useDarkmode.ts'
import { http } from './io/HttpClient.ts'
import { OppgaveTitle } from './OppgaveTitle.tsx'
import { PersonProvider } from './personoversikt/PersonContext.tsx'
import { RequireAuth } from './RequireAuth.tsx'
import { useNyttSaksbilde } from './sak/v2/useNyttSaksbilde.ts'
import { SakTitle } from './SakTitle.tsx'

import { useLogBruker } from './sporing/useLogBruker.ts'
import { useLogVinduStørrelse } from './sporing/useLogVinduStørrelse.ts'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { useInnloggetAnsatt } from './tilgang/useTilgang.ts'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy.tsx'

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

  const { id } = useInnloggetAnsatt()
  if (!id) {
    return null
  }

  return (
    <Theme theme={darkmode ? 'dark' : 'light'}>
      <VStack width="100%" gap="0" style={{ height: '100vh' }}>
        <ErrorBoundary FallbackComponent={GlobalFeilside}>
          <PersonProvider>
            <ToastProvider>
              <Toppmeny />
              <Utviklingsverktøy />
              <ErrorBoundary FallbackComponent={GlobalFeilside}>
                <Suspense fallback={<div />}>
                  {/* TODO Se på denne i forbindelse med at vi bare vil ha scoll i hvert panel og ikke global scroll for hele siden */}
                  <main style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
      </VStack>
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
