import { type OppgaveStatusType, type Sakstype } from '../types/types.internal.ts'
import { OppgaveId } from '../oppgave/oppgaveTypes.ts'

export interface Saksoversikt {
  saker: SaksoversiktSak[]
  barnebrillekrav: SaksoversiktBarnebrillekrav[]
  barnebrillekravHentet: boolean
}

export interface SaksoversiktBase {
  mottattTidspunkt: string
  gjelder: string
  behandletAv?: string
  behandlingsutfall?: string
  behandlingsutfallTidspunkt?: string
  fagsaksystem: 'HOTSAK' | 'BARNEBRILLER'
}

export interface SaksoversiktSak extends SaksoversiktBase {
  sakId: string
  sakstype: Sakstype
  saksstatus: OppgaveStatusType
  saksstatusGyldigFra: string
  område: string[]
  oppgaveId?: OppgaveId
  fagsaksystem: 'HOTSAK'
}

export interface SaksoversiktBarnebrillekrav extends SaksoversiktBase {
  kravId: string
  journalpostId?: string
  dokumentId?: string
  fagsaksystem: 'BARNEBRILLER'
}

export function erSaksoversiktSak(value: SaksoversiktBase): value is SaksoversiktSak {
  return value != null && (value as SaksoversiktSak).fagsaksystem === 'HOTSAK'
}

export function erSaksoversiktBarnebrillekrav(value: SaksoversiktBase): value is SaksoversiktBarnebrillekrav {
  return value != null && (value as SaksoversiktBarnebrillekrav).fagsaksystem === 'BARNEBRILLER'
}
