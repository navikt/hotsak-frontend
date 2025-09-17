import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { useSaksbehandlerErTildeltSak } from '../tilgang/useSaksbehandlerErTildeltSak.ts'
import { OppgaveStatusType } from '../types/types.internal.ts'

export function useSaksregler() {
  const { data: sak } = useSak()?.sak ?? { data: undefined }
  const { isOppgaveContext } = useOppgaveContext()

  const saksbehandlerErTildeltSak = useSaksbehandlerErTildeltSak(sak)

  const kanBehandleSak =
    isOppgaveContext && saksbehandlerErTildeltSak && sak?.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER
  const kanEndreHmsnr =
    isOppgaveContext && saksbehandlerErTildeltSak && sak?.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  console.log(
    'useSaksregler - sak?.status:',
    sak?.status,
    'isOppgaveContext:',
    isOppgaveContext,
    'saksbehandlerErTildeltSak:',
    saksbehandlerErTildeltSak,
    'kanBehandleSak:',
    kanBehandleSak,
    'kanEndreHmsnr:',
    kanEndreHmsnr
  )

  return {
    sakId: sak?.sakId,
    kanEndreHmsnr,
    kanBehandleSak,
  }
}
