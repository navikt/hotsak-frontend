import { usePerson } from '../personoversikt/usePerson.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { useSaksbehandlerErTildeltSak } from '../tilgang/useSaksbehandlerErTildeltSak.ts'
import { OppgaveStatusType, Sakstype, TilgangResultat, TilgangType } from '../types/types.internal.ts'

export function useSaksregler() {
  const { data: sak, tilganger } = useSak()?.sak ?? { data: undefined }
  const { personInfo: person } = usePerson(sak?.bruker.fnr)

  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)

  const kanBehandleSak = !!(saksbehandlerErTildeltSak && sak?.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER)

  const harSkrivetilgang = !!(tilganger?.[TilgangType.KAN_BEHANDLE_SAK] === TilgangResultat.TILLAT)

  return {
    sakId: sak?.sakId,
    kanEndreHmsnr(): boolean {
      return !!(
        sak?.sakstype === Sakstype.BESTILLING &&
        saksbehandlerErTildeltSak &&
        sak?.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER
      )
    },
    kanHenleggeSak(): boolean {
      return !!(saksbehandlerErTildeltSak && person?.dødsdato)
    },
    kanBehandleSak,
    harSkrivetilgang,
  }
}
