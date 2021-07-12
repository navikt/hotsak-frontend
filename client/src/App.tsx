import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import 'reset-css';
import './App.less'
import { GlobalFeilside } from './GlobalFeilside'
//import ReactModal from 'react-modal';
import { HeaderBar as ToppMeny } from './Header'
import { PageNotFound } from './PageNotFound'
import { ProtectedRoute } from './ProtectedRoute'
import { Routes } from './routes'

const Oppgaveliste = React.lazy(() => import('./oppgaveliste/Oppgaveliste'))

//ReactModal.setAppElement('#root');
//const Opptegnelse = React.lazy(() => import('./routes/saksbilde/Opptegnelse'));

function App() {
  return (
    <ErrorBoundary key="asf" FallbackComponent={GlobalFeilside}>
      <BrowserRouter>
        <ToppMeny />
        <React.Suspense fallback={<div />}>
          {/*<Varsler />*/}
          {/*<React.Suspense fallback={<div />}>*/}
          <Switch>
            {/*<Route path={Routes.Uautorisert}>
                        <IkkeLoggetInn />
    </Route>*/}
            <ProtectedRoute path={Routes.Oppgaveliste} exact>
              <Oppgaveliste />
            </ProtectedRoute>
            {/*<ProtectedRoute path={Routes.Saksbilde}>
                        <Saksbilde />
</ProtectedRoute>*/}
            {<Route path="*">
                        <PageNotFound />
</Route>}
          </Switch>
        </React.Suspense>
        {/*</React.Suspense>*/}
        {/*<Toasts />*/}
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
