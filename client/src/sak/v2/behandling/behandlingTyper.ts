import { OppgaveId } from '../../../oppgave/oppgaveTypes'
import { Saksbehandler } from '../../../types/types.internal'

export interface Behandling {
  behandlingId: number
  gjenstående: Gjenstående[]
  utfallLåst?: UtfallLåst[]
  operasjoner: Operasjoner
  utfall?: Behandlingsutfall
  utførtAv?: Saksbehandler
  oppgaveId: OppgaveId
  ferdigstiltTidspunkt?: string
}
export interface LagreBehandlingRequest {
  oppgaveId: OppgaveId
  utfall?: Behandlingsutfall
}

export type Behandlingsutfall = Utfall<VedtaksResultat | HenleggelsesÅrsak | Bestillingsreultat>

export interface Utfall<T extends VedtaksResultat | HenleggelsesÅrsak | Bestillingsreultat> {
  utfall: T
  type: 'VEDTAK' | 'HENLEGGELSE' | 'BESTILLING' | 'OVERFØRING'
}

export interface Operasjoner {
  //vedtak:
  overfør: { gjenstående: GjenståendeOverfør[] }
  //endreUtfall:
}

export enum GjenståendeOverfør {
  BREV_MÅ_SLETTES = 'BREV_MÅ_SLETTES',
  BREV_MÅ_ÅPNES_FOR_REDIGERING_OG_SLETTES = 'BREV_MÅ_ÅPNES_FOR_REDIGERING_OG_SLETTES',
  NOTATUTKAST_MÅ_SLETTES = 'NOTATUTKAST_MÅ_SLETTES',
}

export interface BehandlingerForSak {
  behandlinger: Behandling[]
  gjeldendeBehandling?: Behandling
}

export interface BehandlingerResponse {
  behandlinger: Behandling[]
}

export enum VedtaksResultat {
  INNVILGET = 'INNVILGET',
  AVSLÅTT = 'AVSLÅTT',
  DELVIS_INNVILGET = 'DELVIS_INNVILGET',
  GOSYS = 'GOSYS',
  BRUKER_ER_DØD = 'BRUKER_ER_DØD',
}

enum Bestillingsreultat {
  GODKJENT = 'GODKJENT',
  AVVIST = 'AVVIST',
}

enum HenleggelsesÅrsak {
  BRUKER_ER_DØD = 'BRUKER_ER_DØD',
  DUPLIKAT = 'DUPLIKAT',
  FEIL_BRUKER = 'FEIL_BRUKER',
}

export enum Gjenstående {
  BREV_MANGLER = 'BREV_MANGLER',
  BREV_IKKE_FERDIGSTILT = 'BREV_IKKE_FERDIGSTILT',
  UTFALL_MANGLER = 'UTFALL_MANGLER',
  NOTAT_IKKE_FERDIGSTILT = 'NOTAT_IKKE_FERDIGSTILT',
}

export enum UtfallLåst {
  FERDIGSTILT = 'FERDIGSTILT',
  HAR_VEDTAKSBREV = 'HAR_VEDTAKSBREV',
}
