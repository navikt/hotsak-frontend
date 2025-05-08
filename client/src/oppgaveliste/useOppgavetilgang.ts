import { useMemo } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { AnsattGruppe } from '../tilgang/Ansatt.ts'

export function useOppgavetilgang(): { harSkrivetilgang: boolean } {
  const { grupper } = useInnloggetAnsatt()

  const harSkrivetilgang = useMemo(() => {
    if (window.appSettings.MILJO === 'prod-gcp') {
      return true
    } else {
      // Kun midlertidig logikk for å teste om resten av logikken rundt lesemodus fungerer frem til ny policy løsning er på plass i backend
      return grupper.includes(AnsattGruppe.HOTSAK_SAKSBEHANDLER)
    }
  }, [grupper])

  console.log('Saksbehandler har skrivetilgang til oppgave', { harSkrivetilgang })

  return { harSkrivetilgang }
}
