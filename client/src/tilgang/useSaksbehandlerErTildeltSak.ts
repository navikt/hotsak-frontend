import { useInnloggetSaksbehandler } from '../state/authentication'
import { HarSaksinformasjon } from '../types/types.internal'

export function useSaksbehandlerErTildeltSak<T extends HarSaksinformasjon>(sak?: T): boolean {
  const { id } = useInnloggetSaksbehandler()
  return id === sak?.saksbehandler?.objectId
}
