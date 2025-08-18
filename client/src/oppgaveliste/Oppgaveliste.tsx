import { lazy } from 'react'

import { useNyOppgaveliste } from './useNyOppgaveliste.ts'
import { OppgaveFilterProvider } from './v2/OppgaveFilterProvider.tsx'

const OppgavelisteV1 = lazy(() => import('./v1/OppgavelisteV1.tsx'))
const OppgavelisteV2 = lazy(() => import('./v2/OppgavelisteV2.tsx'))

export default function Oppgaveliste() {
  const [nyOppgaveliste] = useNyOppgaveliste()

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
