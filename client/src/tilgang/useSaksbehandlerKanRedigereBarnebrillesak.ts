import { Barnebrillesak, OppgaveStatusType, SakResponse, StegType } from '../types/types.internal'
import { useSaksbehandlerErTildeltSak } from './useSaksbehandlerErTildeltSak'
import { useSaksbehandlerHarSkrivetilgang } from './useSaksbehandlerHarSkrivetilgang'

export function useSaksbehandlerKanRedigereBarnebrillesak(sakResponse?: SakResponse<Barnebrillesak>): boolean {
  const sak = sakResponse?.data
  const tilganger = sakResponse?.tilganger
  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)
  const harSkrivetilgang = useSaksbehandlerHarSkrivetilgang(tilganger)

  return (
    harSkrivetilgang &&
    saksbehandlerErTildeltSak &&
    sak?.steg !== StegType.GODKJENNE &&
    sak?.steg !== StegType.FERDIG_BEHANDLET &&
    sak?.status !== OppgaveStatusType.AVVENTER_DOKUMENTASJON
  )
}
