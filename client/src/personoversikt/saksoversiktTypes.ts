import { type Fagsaksystem, type Tema } from '../kodeverk/kodeverkTypes.ts'
import { type OppgaveId } from '../oppgave/oppgaveTypes.ts'
import { type OppgaveStatusType, type Sakstype } from '../types/types.internal.ts'

export interface Saksoversikt {
  saker: SaksoversiktSak[]
  fagsaker?: Fagsak[] // fixme -> fjern optional når API er i produksjon
  fagsakerHentet?: boolean // fixme -> fjern optional når API er i produksjon
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

/**
 * SAF har nullable typer på alle felter her, men det stemmer kanskje ikke med virkeligheten.
 *
 * @see [Type: Sak - Team Dokumentløsninger Sysdok - Confluence](https://confluence.adeo.no/x/9oLAEQ)
 */
export interface Fagsak {
  fagsakId?: string
  fagsaksystem?: Fagsaksystem
  tema?: Tema
  sakstype?: 'GENERELL_SAK' | 'FAGSAK'
  datoOpprettet?: Instant
}

export function erSaksoversiktSak(value: SaksoversiktBase): value is SaksoversiktSak {
  return value != null && (value as SaksoversiktSak).fagsaksystem === 'HOTSAK'
}

export function erSaksoversiktBarnebrillekrav(value: SaksoversiktBase): value is SaksoversiktBarnebrillekrav {
  return value != null && (value as SaksoversiktBarnebrillekrav).fagsaksystem === 'BARNEBRILLER'
}
