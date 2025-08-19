import { useMemo } from 'react'

import { AnsattGruppe } from '../tilgang/Ansatt.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'

export function useOppgavetilgang(): { harSkrivetilgang: boolean } {
  const { grupper } = useInnloggetAnsatt()

  const harSkrivetilgang = useMemo(() => {
    return grupper.includes(AnsattGruppe.HOTSAK_SAKSBEHANDLER)
  }, [grupper])

  return { harSkrivetilgang }
}
