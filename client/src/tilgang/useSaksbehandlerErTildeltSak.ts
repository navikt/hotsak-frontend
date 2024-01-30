import { useInnloggetSaksbehandler } from '../state/authentication'
import { HarSakskjerne } from '../types/types.internal'

export function useSaksbehandlerErTildeltSak<T extends HarSakskjerne>(sak?: T): boolean {
  const { id } = useInnloggetSaksbehandler()
  return id === sak?.saksbehandler?.id
}
