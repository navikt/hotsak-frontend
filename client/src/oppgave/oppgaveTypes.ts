import type { PageResponse } from '../felleskomponenter/Page.ts'
import type { Bydel, Enhet, Kommune, Personnavn } from '../types/hotlibs.ts'
import type { OppgaveStatusType, Saksbehandler, Sakstype } from '../types/types.internal'
import type { IntervalString } from '../utils/dato.ts'

/**
 * Oppgave-ID fra Oppgave-API.
 */
export type OppgaveId = string

export enum Oppgavetype {
  JOURNALFØRING = 'JOURNALFØRING',
  BEHANDLE_SAK = 'BEHANDLE_SAK',
  GODKJENNE_VEDTAK = 'GODKJENNE_VEDTAK',
  BEHANDLE_UNDERKJENT_VEDTAK = 'BEHANDLE_UNDERKJENT_VEDTAK',
}

export const OppgavetypeLabel: Record<Oppgavetype, string> = {
  JOURNALFØRING: 'Journalføring',
  BEHANDLE_SAK: 'Behandle sak',
  GODKJENNE_VEDTAK: 'Godkjenne vedtak',
  BEHANDLE_UNDERKJENT_VEDTAK: 'Behandle underkjent vedtak',
}

export enum Oppgavestatus {
  OPPRETTET = 'OPPRETTET',
  ÅPNET = 'ÅPNET',
  UNDER_BEHANDLING = 'UNDER_BEHANDLING',
  FERDIGSTILT = 'FERDIGSTILT',
  FEILREGISTRERT = 'FEILREGISTRERT',
}

export const OppgavestatusLabel: Record<Oppgavestatus, string> = {
  OPPRETTET: 'Mottatt',
  ÅPNET: 'Mottatt',
  UNDER_BEHANDLING: 'Under behandling',
  FERDIGSTILT: 'Ferdigstilt',
  FEILREGISTRERT: 'Feilregistrert',
}

export enum Statuskategori {
  ÅPEN = 'ÅPEN',
  AVSLUTTET = 'AVSLUTTET',
}

export enum Oppgaveprioritet {
  KRITISK = 'KRITISK',
  HØY = 'HØY',
  NORMAL = 'NORMAL',
  LAV = 'LAV',
}

export const OppgaveprioritetLabel: Record<Oppgaveprioritet, string> = {
  KRITISK: 'Kritisk',
  HØY: 'Høy',
  NORMAL: 'Normal',
  LAV: 'Lav',
}

export interface OppgaveBase {
  oppgaveId: OppgaveId
  versjon: number

  /**
   * NB! Journalføringsoppgaver har ikke `sakId`.
   */
  sakId?: string
}

export interface Oppgave extends OppgaveBase {
  statuskategori: Statuskategori
  oppgavestatus: Oppgavestatus
  prioritet: Oppgaveprioritet
  kategorisering: Oppgavekategorisering
  beskrivelse?: string

  // tildeling
  tildeltEnhet: Enhet
  tildeltSaksbehandler?: Saksbehandler

  // tilgang
  opprettetAv?: string
  opprettetAvEnhet?: Enhet
  endretAv?: string
  endretAvEnhet?: Enhet

  // tidspunkter
  aktivDato: string
  fristFerdigstillelse?: string
  opprettetTidspunkt?: string
  endretTidspunkt?: string
  ferdigstiltTidspunkt?: string
  isPåVent?: boolean

  // tilknytning
  fnr?: string
  bruker?: OppgaveBruker
  innsender?: OppgaveInnsender
  journalpostId?: string
  sak?: OppgaveSak
  behandlesAvApplikasjon?: string

  // totrinnskontroll
  totrinnskontroll?: OppgaveTotrinnskontroll

  // mappe
  mappeId?: string
  mappenavn?: string

  // oppgavebehandling
  sistLest?: string
  isUlest?: boolean

  isBehandlesAvApplikasjonHotsak: boolean
  isJournalføringsoppgave: boolean
}

export interface OppgaveMappe {
  id: number
  enhet: string
  navn: string
  tema: string
  versjon: number
  opprettetAv: string
  opprettetTidspunkt: string
  endretAv: string | null
  endretTidspunkt: string | null
}

export interface OppgaveMapperResponse {
  totalElements: number
  mapper: OppgaveMappe[]
}

export interface Journalføringsoppgave extends Oppgave {
  kategorisering: Oppgavekategorisering<Oppgavetype.JOURNALFØRING>
  journalpostId: string
}

export type SaksbehandlingOppgavetype =
  Oppgavetype.BEHANDLE_SAK | Oppgavetype.GODKJENNE_VEDTAK | Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK

export interface SaksbehandlingsoppgaveBase extends OppgaveBase {
  sakId: string
}

export interface Saksbehandlingsoppgave extends Oppgave {
  kategorisering: Oppgavekategorisering<SaksbehandlingOppgavetype>
  sakId: string
  sak: OppgaveSak
}

export function isJournalføringsoppgave(oppgave: Oppgave): oppgave is Journalføringsoppgave {
  return oppgave.kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING
}

export function isSaksbehandlingsoppgave(oppgave: Oppgave): oppgave is Saksbehandlingsoppgave {
  return oppgave.kategorisering.oppgavetype !== Oppgavetype.JOURNALFØRING
}

export interface OppgaveKodeverk {
  kode: string
  term: string
}

export interface KodeverkGjelder {
  behandlingstema?: OppgaveKodeverk | null
  behandlingstype?: OppgaveKodeverk | null
}

export interface Oppgavekategorisering<T extends Oppgavetype = Oppgavetype> {
  oppgavetype: T
  behandlingstema?: OppgaveKodeverk
  behandlingstype?: OppgaveKodeverk
  tema: 'HJE' | string
}

export interface OppgaveBruker {
  fnr: string
  navn: Personnavn
  fulltNavn: string
  fødselsdato?: string
  alder?: number
  kommune?: Kommune
  bydel?: Bydel
  brukernummer?: string
}

export interface OppgaveInnsender {
  fnr: string
  navn: Personnavn
  fulltNavn: string
}

export interface OppgaveSak {
  sakId: string
  sakstype: Sakstype
  saksstatus: OppgaveStatusType
  søknadId: string
  søknadGjelder: string
}

export interface OppgaveTotrinnskontroll {
  saksbehandlerId: string
  godkjennerId?: string
}

export interface FinnOppgaverRequest {
  statuskategori?: Statuskategori
  oppgavetype?: Oppgavetype[]

  // tildeling
  brukerId?: string
  journalpostId?: string[]
  sakId?: string[]

  tildelt?: OppgaveTildelt

  // tidspunkter
  opprettetIntervall?: IntervalString
  aktivIntervall?: IntervalString
  fristIntervall?: IntervalString
  ferdigstiltIntervall?: IntervalString

  // sortering
  sorteringsfelt?: 'FRIST' | 'OPPRETTET_TIDSPUNKT'
  sorteringsrekkefølge?: 'ASC' | 'DESC'

  pageNumber?: number
  pageSize?: number
}

export interface FinnOppgaverResponse extends PageResponse {
  oppgaver: Oppgave[]
  totalPages: number
}

export enum OppgaveTildelt {
  INGEN = 'INGEN',
  MEDARBEIDER = 'MEDARBEIDER',
  MEG = 'MEG',
}

/**
 * Koblingen mellom sak og oppgave som lagres i Hotsak.
 */
export interface Oppgavetilknytning {
  oppgaveId: OppgaveId
  sakId: string
  oppgavetype: Oppgavetype
  opprettet: string
  ferdigstilt?: string
  feilregistrert?: string
  statuskategori: Statuskategori
}
