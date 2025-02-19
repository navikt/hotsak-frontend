import { useMemo } from 'react'
import { Gruppe, useInnloggetSaksbehandler } from '../state/authentication.ts'

export function useOppgavetilgang(): { harSkrivetilgang: boolean } {
  const { grupper } = useInnloggetSaksbehandler()

  const harSkrivetilgang = useMemo(() => {
    if (window.appSettings.MILJO === 'prod-gcp' || window.appSettings.MILJO === 'dev-gcp') {
      return true
    } else {
      return grupper.includes(Gruppe.HOTSAK_SAKSBEHANDLER)
    }
  }, [grupper])

  return { harSkrivetilgang }
}
