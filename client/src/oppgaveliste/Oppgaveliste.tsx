import { lazy } from 'react'
import { Route, Routes } from 'react-router'

import { useNyOppgaveliste } from './useNyOppgaveliste.ts'
import { OppgavelisteTabs } from './v3/OppgavelisteTabs.tsx'

const OppgavelisteV1 = lazy(() => import('./v1/OppgavelisteV1.tsx'))
const MineOppgaverWrapper = lazy(() => import('./v3/MineOppgaverWrapper.tsx'))
const EnhetensOppgaverWrapper = lazy(() => import('./v3/EnhetensOppgaverWrapper.tsx'))

export default function Oppgaveliste() {
  const [nyOppgaveliste] = useNyOppgaveliste()

  if (nyOppgaveliste) {
    return (
      <>
        <OppgavelisteTabs />
        <Routes>
          <Route path="/" element={<MineOppgaverWrapper />} />
          <Route path="/mine" element={<MineOppgaverWrapper />} />
          <Route path="/ko" element={<EnhetensOppgaverWrapper />} />
        </Routes>
      </>
    )
  }

  return (
    <>
      <OppgavelisteV1 />
    </>
  )
}
