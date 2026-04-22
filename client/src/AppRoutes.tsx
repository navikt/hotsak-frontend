import { lazy } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import classes from './AppRoutes.module.css'

import { Feilside } from './feilsider/Feilside.tsx'
import { AsyncBoundary } from './felleskomponenter/AsyncBoundary.tsx'
import { RequireAuth } from './RequireAuth.tsx'

const Oppgave = lazy(() => import('./oppgave/Oppgave.tsx'))
const Oppgaveliste = lazy(() => import('./oppgaveliste/Oppgaveliste.tsx'))
const Personoversikt = lazy(() => import('./personoversikt/Personoversikt.tsx'))
const Saksbilde = lazy(() => import('./saksbilde/Saksbilde.tsx'))

export function AppRoutes() {
  return (
    <AsyncBoundary suspenseFallback={null}>
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

        {/* Ruter hvor det er naturlig med global, vertikal scroll */}
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
    </AsyncBoundary>
  )
}

// TODO slå sammen PanelLayout og ScrollableLayout til en komponent som tar inn en prop for om den skal være scrollable eller ikke, så slipper vi å duplisere Outlet og Routes
function PanelLayout() {
  return (
    <main className={classes.panelLayout}>
      <Outlet />
    </main>
  )
}

function SideLayout() {
  return (
    <main className={classes.sideLayout}>
      <Outlet />
    </main>
  )
}
