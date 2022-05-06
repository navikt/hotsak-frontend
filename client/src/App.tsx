import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { hot } from 'react-hot-loader'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { amplitude_taxonomy, logAmplitudeEvent } from './utils/amplitude'

import { ProtectedRoute } from './ProtectedRoute'
import { Feilside } from './feilsider/Feilside'
import { GlobalFeilside } from './feilsider/GlobalFeilside'
import { Toppmeny } from './header/Header'
import { PersonProvider } from './personoversikt/PersonContext'
import { Routes } from './routes'
import { useAuthentication } from './state/authentication'

const Oppgaveliste = React.lazy(() => import('./oppgaveliste/Oppgaveliste'))
const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde'))
const Bestillingsbilde = React.lazy(() => import('./saksbilde/bestillingsordning/Bestillingsbilde'))
const Personoversikt = React.lazy(() => import('./personoversikt/Personoversikt'))

//ReactModal.setAppElement('#root');

const App: React.VFC = () => {
  useAuthentication()
  logUserStats()
  return (
    <ErrorBoundary FallbackComponent={GlobalFeilside}>
      <PersonProvider>
        <Toppmeny />
        <ErrorBoundary FallbackComponent={GlobalFeilside}>
          <React.Suspense fallback={<div />}>
            {/*<Varsler />*/}
            <main>
              <Switch>
                <Route path={Routes.Uautorisert}>
                  <Feilside statusCode={401} />
                </Route>
                <ProtectedRoute path={Routes.Oppgaveliste} exact>
                  <Oppgaveliste />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Saksbilde}>
                  <Saksbilde />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Bestillingsbildet}>
                  <Bestillingsbilde />
                </ProtectedRoute>
                <ProtectedRoute path={Routes.Personoversikt}>
                  <Personoversikt />
                </ProtectedRoute>
                <Route path="*">
                  <Feilside statusCode={404} />
                </Route>
              </Switch>
            </main>
          </React.Suspense>
        </ErrorBoundary>
      </PersonProvider>
      {/*<Toasts />*/}
    </ErrorBoundary>
  )
}

const logUserStats = (): void => {
  const { innerWidth: width, innerHeight: height } = window
  logAmplitudeEvent(amplitude_taxonomy.CLIENT_INFO, { res: { width, height } })
}

const withRoutingAndState = (Component: React.ComponentType) => (): JSX.Element =>
  (
    <BrowserRouter>
      <RecoilRoot>
        <Component />
      </RecoilRoot>
    </BrowserRouter>
  )

export default hot(module)(withRoutingAndState(App))
