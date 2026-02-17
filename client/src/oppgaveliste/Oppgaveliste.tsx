import { lazy } from 'react'
import { Route, Routes } from 'react-router'

import { OppgavelisteTabs } from './OppgavelisteTabs.tsx'

const MineOppgaverWrapper = lazy(() => import('./MineOppgaverWrapper.tsx'))
const EnhetensOppgaverWrapper = lazy(() => import('./EnhetensOppgaverWrapper.tsx'))
const MedarbeidersOppgaverWrapper = lazy(() => import('./MedarbeidersOppgaverWrapper.tsx'))

export default function Oppgaveliste() {
  return (
    <>
      <OppgavelisteTabs />
      <Routes>
        <Route path="/" element={<MineOppgaverWrapper />} />
        <Route path="/mine" element={<MineOppgaverWrapper />} />
        <Route path="/enhetens" element={<EnhetensOppgaverWrapper />} />
        <Route path="/medarbeiders" element={<MedarbeidersOppgaverWrapper />} />
      </Routes>
    </>
  )
}
