import { useMemo } from 'react'

import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { AnsattGruppe } from '../tilgang/Ansatt.ts'

export function useOppgavetilgang(): { harSkrivetilgang: boolean } {
  const { grupper } = useInnloggetAnsatt()

  const harSkrivetilgang = useMemo(() => {
    return grupper.includes(AnsattGruppe.HOTSAK_SAKSBEHANDLER)
  }, [grupper])

  console.log('Saksbehandler har skrivetilgang til oppgave', { harSkrivetilgang })

  return { harSkrivetilgang }
}
