import { lazy } from 'react'
import { Route, Routes } from 'react-router'

import { useNyOppgaveliste } from './useNyOppgaveliste.ts'
import { OppgaveFilterProvider } from './v2/OppgaveFilterProvider.tsx'
import { EnhetensOppgaver } from './v3/EnhetensOppgaver.tsx'
import { MineOppgaver } from './v3/MineOppgaver.tsx'
import { OppgavelisteTabs } from './v3/OppgavelisteTabs.tsx'

const OppgavelisteV1 = lazy(() => import('./v1/OppgavelisteV1.tsx'))
const OppgavelisteV2 = lazy(() => import('./v2/OppgavelisteV2.tsx'))

export default function Oppgaveliste() {
  const [nyOppgaveliste] = useNyOppgaveliste()

  if (nyOppgaveliste) {
    return (
      <>
        <OppgavelisteTabs />
        <Routes>
          <Route path="/" element={<MineOppgaver />} />
          <Route path="/mine" element={<MineOppgaver />} />
          <Route path="/ko" element={<EnhetensOppgaver />} />
        </Routes>
      </>
    )
  }

  if (nyOppgaveliste) {
    return (
      <OppgaveFilterProvider>
        <OppgavelisteV2 />
      </OppgaveFilterProvider>
    )
  }

  return (
    <>
      <OppgavelisteV1 />
    </>
  )
}
