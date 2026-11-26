import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useBehovsmelding } from '../saksbilde/useBehovsmelding.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { Sakstype, SøknadslinjeType } from '../types/types.internal.ts'

export function useSaksregler() {
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const { behovsmelding } = useBehovsmelding()
  const { sak } = useSak()
  const sakstype = oppgave?.sak?.sakstype

  return {
    sakId: oppgave?.sakId,
    kanBehandleSak: oppgaveErUnderBehandlingAvInnloggetAnsatt,
    kanEndreHjelpemiddel: oppgaveErUnderBehandlingAvInnloggetAnsatt,
    erBestilling: sakstype === Sakstype.BESTILLING,
    erSøknad: sakstype === Sakstype.SØKNAD,
    erBarnebrillesak: sakstype === Sakstype.BARNEBRILLER,
    erPapirsøknad: behovsmelding?.skjemaversjon === -1,
    harTilskudd: !!sak?.data.søknadslinjer?.some(
      (søknadslinje) => søknadslinje.type === SøknadslinjeType.TILSKUDD_RIMELIGE_HJELPEMIDLER
    ),
  }
}
