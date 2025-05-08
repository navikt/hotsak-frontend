import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'

/**
 * todo -> slett denne og bruk useInnloggetAnsatt() direkte.
 */
export function useInnloggetSaksbehandler() {
  return useInnloggetAnsatt()
}
