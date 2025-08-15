import { useErIOppgavekontekst } from '../oppgave/OppgaveContext.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { useSaksbehandlerErTildeltSak } from '../tilgang/useSaksbehandlerErTildeltSak.ts'
import { OppgaveStatusType } from '../types/types.internal.ts'

export function useSaksregler() {
  const { data: sak } = useSak()?.sak ?? { data: undefined }
  const erIOppgavekontekst = useErIOppgavekontekst()

  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)

  const kanBehandleSak =
    erIOppgavekontekst && saksbehandlerErTildeltSak && sak?.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER
  const kanEndreHmsnr =
    erIOppgavekontekst && saksbehandlerErTildeltSak && sak?.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  return {
    sakId: sak?.sakId,
    kanEndreHmsnr,
    kanBehandleSak,
  }
}
