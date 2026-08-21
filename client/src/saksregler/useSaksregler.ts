import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useBehovsmelding } from '../saksbilde/useBehovsmelding.ts'
import { Kanal, Sakstype } from '../types/types.internal.ts'
import { useMiljø } from '../utils/useMiljø.ts'

export function useSaksregler() {
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const { behovsmelding } = useBehovsmelding()
  const { erProd } = useMiljø()

  return {
    sakId: oppgave?.sakId,
    kanBehandleSak: oppgaveErUnderBehandlingAvInnloggetAnsatt,
    kanEndreHjelpemiddel: oppgaveErUnderBehandlingAvInnloggetAnsatt,
    erBestilling: oppgave?.sak?.sakstype === Sakstype.BESTILLING,
    erSøknad: oppgave?.sak?.sakstype === Sakstype.SØKNAD,
    erBarnebrillesak: oppgave?.sak?.sakstype === Sakstype.BARNEBRILLER,
    erPapirsøknad: !erProd && behovsmelding?.kanal === Kanal.SKAN_IM,
  }
}
