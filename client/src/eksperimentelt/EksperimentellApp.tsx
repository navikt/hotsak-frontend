import { Theme, VStack } from '@navikt/ds-react'
import { lazy, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route, Routes } from 'react-router'
import { Feilside } from '../feilsider/Feilside'
import { GlobalFeilside } from '../feilsider/GlobalFeilside'
import { ToastProvider } from '../felleskomponenter/toast/ToastContext'
import { useDarkmode } from '../header/useDarkmode'
import { OppgaveTitle } from '../OppgaveTitle'
import { PersonProvider } from '../personoversikt/PersonContext'
import { RequireAuth } from '../RequireAuth'
import { Utviklingsverktøy } from '../utvikling/Utviklingsverktøy'
import { ToppmenyEksperiment } from './eksperimenter/ToppmenyEksperiment.tsx'

const Oppgaveliste = lazy(() => import('../oppgaveliste/Oppgaveliste.tsx'))
const OppgaveEksperiment = lazy(() => import('./eksperimenter/KabalInspirert/OppgaveEksperiment.tsx'))

export function EksperimentellApp() {
  const [darkmode] = useDarkmode()
  return (
    <Theme theme={darkmode ? 'dark' : 'light'}>
      <VStack width="100%" gap="0" style={{ height: '100vh', backgroundColor: 'var(--ax-bg-neutral-moderate) ' }}>
        <ErrorBoundary FallbackComponent={GlobalFeilside}>
          <PersonProvider>
            <ToastProvider>
              <ToppmenyEksperiment />
              <Utviklingsverktøy />
              <ErrorBoundary FallbackComponent={GlobalFeilside}>
                <Suspense fallback={<div />}>
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
                        path="/oppgave/:oppgaveId/*"
                        element={
                          <RequireAuth>
                            <OppgaveTitle />
                            <OppgaveEksperiment />
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
