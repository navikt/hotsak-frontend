import { OppgaveId } from '../oppgave/oppgaveTypes'
import { Saksbehandler } from './types.internal'

export interface Behandling {
  behandlingId: number
  gjenstående: Gjenstående[]
  utfallLåst?: UtfallLåst[]
  utfall?: Behandlingsutfall
  utførtAv?: Saksbehandler
  oppgaveId: string
  ferdigstiltTidspunkt?: string
}
export interface LagreBehandlingRequest {
  oppgaveId: string
  utfall?: Behandlingsutfall
}

export type Behandlingsutfall = Utfall<VedtaksResultat | HenleggelsesÅrsak | Bestillingsreultat>

export interface Utfall<T extends VedtaksResultat | HenleggelsesÅrsak | Bestillingsreultat> {
  utfall: T
  type: 'VEDTAK' | 'HENLEGGELSE' | 'BESTILLING'
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
}

export enum UtfallLåst {
  FERDIGSTILT = 'FERDIGSTILT',
  BREV_PÅBEGYNT = 'BREV_PÅBEGYNT',
}

export interface FerdigstillBehandling {
  sakId: string
  oppgaveId: OppgaveId
}
