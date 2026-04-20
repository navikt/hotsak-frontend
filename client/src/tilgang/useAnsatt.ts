import useSWR from 'swr'

import type { Enhet, Personnavn } from '../types/hotlibs.ts'

/**
 * Hent ansatt fra Entra-Proxy.
 *
 * @param navIdent
 */
export function useAnsatt(navIdent?: string) {
  return useSWR<UtvidetAnsatt>(navIdent?.length === 7 ? `/api/ansatte/${navIdent}` : null)
}

export interface UtvidetAnsatt extends Personnavn {
  navIdent: string
  epost: string
  enhet: Enhet
}
