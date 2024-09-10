import { useSak } from '../saksbilde/useSak.ts'
import { useSaksbehandlerErTildeltSak } from '../tilgang/useSaksbehandlerErTildeltSak.ts'

export function useSaksregler() {
  const { data: sak } = useSak()?.sak ?? { data: undefined }
  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)
  return {
    sakId: sak?.sakId,
    kanHenleggeSak(): boolean {
      return !!(saksbehandlerErTildeltSak && sak?.bruker?.dødsdato)
    },
  }
}
