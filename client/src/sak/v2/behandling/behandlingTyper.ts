import type { OppgaveId } from '../../../oppgave/oppgaveTypes'
import type { NavIdent } from '../../../tilgang/Ansatt.ts'

export interface Behandling {
  behandlingId: number
  gjenstående: Gjenstående[]
  utfallLåst?: UtfallLåst[]
  operasjoner: Operasjoner
  utfall?: Behandlingsutfall
  utførtAv?: NavIdent
  oppgaveId: OppgaveId
  ferdigstiltTidspunkt?: string
}

export interface LagreBehandlingRequest {
  oppgaveId: OppgaveId
  utfall?: Behandlingsutfall
}

export type BehandlingsutfallType = VedtaksResultat | Bestillingsresultat | Henleggelsesårsak | OverførtTil

interface Utfall<T extends BehandlingsutfallType> {
  utfall: T
  type: 'VEDTAK' | 'BESTILLING' | 'HENLEGGELSE' | 'OVERFØRING'
}

export type BehandlingsutfallVedtak = Utfall<VedtaksResultat>
export type BehandlingsutfallBestilling = Utfall<Bestillingsresultat>
export type BehandlingsutfallHenleggelse = Utfall<Henleggelsesårsak>
export type BehandlingsutfallOverføring = Utfall<OverførtTil>

export type Behandlingsutfall =
  | BehandlingsutfallVedtak
  | BehandlingsutfallBestilling
  | BehandlingsutfallHenleggelse
  | BehandlingsutfallOverføring

export function isBehandlingsutfallVedtak(utfall?: Behandlingsutfall): utfall is BehandlingsutfallVedtak {
  return utfall != null && utfall.type === 'VEDTAK'
}

export function isBehandlingsutfallBestilling(utfall?: Behandlingsutfall): utfall is BehandlingsutfallBestilling {
  return utfall != null && utfall.type === 'BESTILLING'
}

export function isBehandlingsutfallHenleggelse(utfall?: Behandlingsutfall): utfall is BehandlingsutfallHenleggelse {
  return utfall != null && utfall.type === 'HENLEGGELSE'
}

export function isBehandlingsutfallOverføring(utfall?: Behandlingsutfall): utfall is BehandlingsutfallOverføring {
  return utfall != null && utfall.type === 'OVERFØRING'
}

export interface Operasjoner {
  // vedtak:
  overfør: { gjenstående: GjenståendeOverfør[] }
  // endreUtfall:
  angreVedtak: { angringLåst: AngringLåst[] }
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

// todo -> bruke samme navn som i backend `Vedtaksresultat`
export enum VedtaksResultat {
  INNVILGET = 'INNVILGET',
  AVSLÅTT = 'AVSLÅTT',
  DELVIS_INNVILGET = 'DELVIS_INNVILGET',
}

export enum Bestillingsresultat {
  GODKJENT = 'GODKJENT',
  AVVIST = 'AVVIST',
}

export enum Henleggelsesårsak {
  BRUKER_ER_DØD = 'BRUKER_ER_DØD',
  DUPLIKAT = 'DUPLIKAT',
  FEIL_BRUKER = 'FEIL_BRUKER',
}

export enum OverførtTil {
  GOSYS = 'GOSYS',
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
  MIDLERTIDIG_FERDIGSTILT = 'MIDLERTIDIG_FERDIGSTILT',
}

export enum AngringLåst {
  ANGRE_TID_UTLØPT = 'ANGRE_TID_UTLØPT',
}
