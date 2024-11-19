import { useInnloggetSaksbehandler } from '../state/authentication'
import type { SakBase } from '../types/types.internal'

export function useSaksbehandlerErTildeltSak<T extends SakBase>(sak?: T): boolean {
  const { id } = useInnloggetSaksbehandler()
  return id === sak?.saksbehandler?.id
}
