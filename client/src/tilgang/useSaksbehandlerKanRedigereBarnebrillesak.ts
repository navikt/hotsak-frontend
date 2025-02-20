import { BarnebrillesakResponse, OppgaveStatusType, StegType } from '../types/types.internal'
import { useSaksbehandlerErTildeltSak } from './useSaksbehandlerErTildeltSak'
import { useSaksbehandlerHarSkrivetilgang } from './useSaksbehandlerHarSkrivetilgang'

export function useSaksbehandlerKanRedigereBarnebrillesak(sakResponse?: BarnebrillesakResponse): boolean {
  const sak = sakResponse?.data
  const tilganger = sakResponse?.tilganger
  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)
  const harSkrivetilgang = useSaksbehandlerHarSkrivetilgang(tilganger)

  const saksbehandlerKanRedigereBarnebrillesak =
    harSkrivetilgang &&
    saksbehandlerErTildeltSak &&
    sak?.steg !== StegType.GODKJENNE &&
    sak?.steg !== StegType.FERDIG_BEHANDLET &&
    sak?.status !== OppgaveStatusType.AVVENTER_DOKUMENTASJON
  return saksbehandlerKanRedigereBarnebrillesak
}
