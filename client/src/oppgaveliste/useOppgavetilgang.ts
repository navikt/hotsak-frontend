import { useMemo } from 'react'
import { Gruppe, useInnloggetSaksbehandler } from '../state/authentication.ts'

export function useOppgavetilgang(): { harSkrivetilgang: boolean } {
  const { grupper } = useInnloggetSaksbehandler()

  const harSkrivetilgang = useMemo(() => {
    if (window.appSettings.MILJO === 'prod-gcp') {
      return true
    } else {
      // Kun midlertidig logikk for å teste om resten av logikken rundt lesemodus fungerer frem til ny policy løsning er på plass i backend
      return grupper.includes(Gruppe.HOTSAK_SAKSBEHANDLER)
    }
  }, [grupper])

  console.log('Saksbehandler har skrivetilgang til oppgave', { harSkrivetilgang })

  return { harSkrivetilgang }
}
