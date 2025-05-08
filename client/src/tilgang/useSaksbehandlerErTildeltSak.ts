import type { SakBase } from '../types/types.internal'
import { useInnloggetAnsatt } from './useTilgang.ts'

export function useSaksbehandlerErTildeltSak<T extends SakBase>(sak?: T): boolean {
  const { id } = useInnloggetAnsatt()
  return id === sak?.saksbehandler?.id
}
