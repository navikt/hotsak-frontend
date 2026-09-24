import { useUnleashContext } from '@unleash/proxy-client-react'
import { useEffect } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'

/**
 * Synkroniserer Unleash-konteksten med saksbehandlerens valgte enhet.
 *
 * Må rendres et sted innenfor både `FlagProvider` og `TilgangProvider`, slik
 * at både Unleash-klienten og innlogget ansatt er tilgjengelig. Komponenten
 * rendrer ikke noe selv.
 */
export function UnleashEnhetContext() {
  const updateContext = useUnleashContext()
  const { gjeldendeEnhet } = useInnloggetAnsatt()

  useEffect(() => {
    void updateContext({ properties: { enhet: gjeldendeEnhet.nummer } })
  }, [updateContext, gjeldendeEnhet.nummer])

  return null
}
