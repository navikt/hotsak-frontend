import { usePerson } from '../personoversikt/usePerson.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { useSaksbehandlerErTildeltSak } from '../tilgang/useSaksbehandlerErTildeltSak.ts'
import { OppgaveStatusType, Sakstype, TilgangResultat, TilgangType } from '../types/types.internal.ts'

export function useSaksregler() {
  const { data: sak, tilganger } = useSak()?.sak ?? { data: undefined }
  const { personInfo: person } = usePerson(sak?.bruker.fnr)

  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)

  const kanBehandleSak = !!(saksbehandlerErTildeltSak && sak?.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER)

  let harSkrivetilgang

  // Hardkoder foreløpig til skrivetilgang i dev og prod frem til backend er klar for å vise dette på sak
  if (window.appSettings.MILJO === 'prod-gcp' || window.appSettings.MILJO === 'dev-gcp') {
    harSkrivetilgang = true
  } else {
    harSkrivetilgang = !!(tilganger?.[TilgangType.KAN_BEHANDLE_SAK] === TilgangResultat.TILLAT)
  }

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
