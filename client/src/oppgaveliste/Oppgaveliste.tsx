import { lazy } from 'react'
import { Route, Routes } from 'react-router'

import { OppgavelisteTabs } from './v2/OppgavelisteTabs.tsx'

const MineOppgaverWrapper = lazy(() => import('./v2/MineOppgaverWrapper.tsx'))
const EnhetensOppgaverWrapper = lazy(() => import('./v2/EnhetensOppgaverWrapper.tsx'))
const MedarbeidersOppgaverWrapper = lazy(() => import('./v2/MedarbeidersOppgaverWrapper.tsx'))

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
