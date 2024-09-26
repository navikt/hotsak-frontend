import { usePerson } from '../personoversikt/usePerson.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { useSaksbehandlerErTildeltSak } from '../tilgang/useSaksbehandlerErTildeltSak.ts'

export function useSaksregler() {
  const { data: sak } = useSak()?.sak ?? { data: undefined }
  const { personInfo: person } = usePerson(sak?.bruker.fnr)

  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)
  return {
    sakId: sak?.sakId,
    kanHenleggeSak(): boolean {
      return !!(saksbehandlerErTildeltSak && person?.dødsdato)
    },
  }
}
