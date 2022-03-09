
import React from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import { hot } from 'react-hot-loader'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { IkkeLoggetInn } from './routes/IkkeLoggetInn'
import { Toppmeny } from './Header'
import { ProtectedRoute } from './ProtectedRoute'
import { GlobalFeilside } from './feilsider/GlobalFeilside'

import { PageNotFound } from './feilsider/PageNotFound'
import { Routes } from './routes'
import { useAuthentication } from './state/authentication'
import { amplitude_taxonomy, logAmplitudeEvent } from './utils/amplitude'
import { PersonProvider } from './personoversikt/PersonContext'

const Oppgaveliste = React.lazy(() => import('./oppgaveliste/Oppgaveliste'))
const Saksbilde = React.lazy(() => import('./saksbilde/Saksbilde'))
const Personoversikt = React.lazy(() => import('./personoversikt/Personoversikt'))

//ReactModal.setAppElement('#root');

function App() {
  useAuthentication()
  logUserStats()
  return (
    <ErrorBoundary FallbackComponent={GlobalFeilside}>
        <PersonProvider>
      <Toppmeny />
      <React.Suspense fallback={<div />}>
        {/*<Varsler />*/}
        
          <Switch>
            <Route path={Routes.Uautorisert}>
              <IkkeLoggetInn />
            </Route>
            <ProtectedRoute path={Routes.Oppgaveliste} exact>
              <Oppgaveliste />
            </ProtectedRoute>
            <ProtectedRoute path={Routes.Saksbilde}>
              <Saksbilde />
            </ProtectedRoute>
            <ProtectedRoute path={Routes.Personoversikt}>
              <Personoversikt />
  </ProtectedRoute>
            <Route path="*">
              <PageNotFound />
            </Route>
          </Switch>
       
      </React.Suspense>
      </PersonProvider>
      {/*</React.Suspense>*/}
      {/*<Toasts />*/}
    </ErrorBoundary>
  )
}

const logUserStats = () => {
  const { innerWidth: width, innerHeight: height } = window
  logAmplitudeEvent(amplitude_taxonomy.CLIENT_INFO, { res: { width, height } })
}

const withRoutingAndState = (Component: React.ComponentType) => () =>
  (
    <BrowserRouter>
      <RecoilRoot>
        <Component />
      </RecoilRoot>
    </BrowserRouter>
  )

export default hot(module)(withRoutingAndState(App))
