import { useDebugValue } from 'react'

import { Barnebrillesak, OppgaveStatusType, StegType } from '../types/types.internal'
import { useSaksbehandlerErTildeltSak } from './useSaksbehandlerErTildeltSak'

export function useSaksbehandlerKanRedigereBarnebrillesak(sak?: Barnebrillesak): boolean {
  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)
  const sakIVentestatus = sak?.status === OppgaveStatusType.AVVENTER_DOKUMENTASJON
  const saksbehandlerKanRedigereBarnebrillesak =
    saksbehandlerErTildeltSak && sak?.steg !== StegType.GODKJENNE && sak?.steg !== StegType.FERDIG_BEHANDLET
  useDebugValue(saksbehandlerKanRedigereBarnebrillesak)
  return saksbehandlerKanRedigereBarnebrillesak && !sakIVentestatus
}
