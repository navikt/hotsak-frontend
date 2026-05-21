import useSWRImmutable from 'swr/immutable'

import type { HttpError } from '../io/HttpError.ts'
import type { Enhet, Personnavn } from '../types/hotlibs.ts'
import { isNavIdent } from './Ansatt.ts'

/**
 * Hent ansatt fra Entra-Proxy.
 *
 * @param navIdent
 */
export function useAnsatt(navIdent?: string) {
  return useSWRImmutable<UtvidetAnsatt, HttpError>(isNavIdent(navIdent) ? `/api/ansatte/${navIdent}` : null)
}

export interface UtvidetAnsatt extends Personnavn {
  navIdent: string
  epost: string
  enhet: Enhet
}
