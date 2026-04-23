import { lazy } from 'react'
import { Outlet, Route, Routes } from 'react-router-dom'

import classes from './AppRoutes.module.css'
import { AsyncBoundary } from './felleskomponenter/AsyncBoundary.tsx'
import { Feilmelding } from './felleskomponenter/feil/Feilmelding.tsx'
import { Protected } from './tilgang/Protected.tsx'

const Oppgave = lazy(() => import('./oppgave/Oppgave.tsx'))
const MineOppgaver = lazy(() => import('./oppgaveliste/MineOppgaverWrapper.tsx'))
const EnhetensOppgaver = lazy(() => import('./oppgaveliste/EnhetensOppgaverWrapper.tsx'))
const MedarbeidersOppgaver = lazy(() => import('./oppgaveliste/MedarbeidersOppgaverWrapper.tsx'))

const Saksbilde = lazy(() => import('./saksbilde/Saksbilde.tsx'))

const Personoversikt = lazy(() => import('./personoversikt/Personoversikt.tsx'))

export function AppRoutes() {
  return (
    <AsyncBoundary suspenseFallback={null}>
      <Routes>
        <Route element={<Protected />}>
          {/* Ruter hvor paneler kan scrolles uavhengig og ingen global scroll */}
          <Route element={<PanelLayout />}>
            <Route path="sak/:sakId/*" element={<Saksbilde />} />
            <Route path="oppgave/:oppgaveId/*" element={<Oppgave />} />
          </Route>

          {/* Ruter hvor det er naturlig med global, vertikal scroll */}
          <Route element={<SideLayout />}>
            <Route index element={<MineOppgaver />} />
            <Route path="oppgaver">
              <Route index element={<MineOppgaver />} />
              <Route path="mine" element={<MineOppgaver />} />
              <Route path="enhetens" element={<EnhetensOppgaver />} />
              <Route path="medarbeiders" element={<MedarbeidersOppgaver />} />
            </Route>
            <Route path="personoversikt/*" element={<Personoversikt />} />
          </Route>
        </Route>

        <Route path="uautorisert" element={<Feilmelding status={401} />} />
        <Route path="*" element={<Feilmelding status={404} />} />
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
