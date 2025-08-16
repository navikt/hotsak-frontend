import { lazy } from 'react'

import { useNyOppgaveliste } from './useNyOppgaveliste.ts'
import { FilterProvider } from './v2/FilterContext.tsx'

const OppgavelisteV1 = lazy(() => import('./v1/OppgavelisteV1.tsx'))
const OppgavelisteV2 = lazy(() => import('./v2/OppgavelisteV2.tsx'))

export default function Oppgaveliste() {
  const [nyOppgaveliste] = useNyOppgaveliste()

  if (nyOppgaveliste) {
    return (
      <FilterProvider>
        <OppgavelisteV2 />
      </FilterProvider>
    )
  }

  return (
    <>
      <OppgavelisteV1 />
    </>
  )
}
