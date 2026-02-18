import type { SortState } from '@navikt/ds-react'

import type { PageResponse } from '../felleskomponenter/Page.ts'
import type { Bydel, Enhet, Kommune, Navn, Saksbehandler, Sakstype } from '../types/types.internal'
import { type IntervalString } from '../utils/dato.ts'
import { isInteger, isString } from '../utils/type.ts'

/**
 * Oppgaven er opprettet i felles oppgaveløsning.
 */
type EksternOppgaveId = string

/**
 * Oppgaven er kun opprettet i Hotsak-tabellen `oppgave_v1`.
 */
type InternOppgaveId = `I-${number}`

/**
 * Vi har to ulike typer `OppgaveId`. Typen forteller oss hvor oppgaven er lagret.
 */
export type OppgaveId = EksternOppgaveId | InternOppgaveId

export function erEksternOppgaveId(value: unknown): value is EksternOppgaveId {
  return isInteger(value)
}

export function erInternOppgaveId(value: unknown): value is InternOppgaveId {
  return isString(value) && value.substring(0, 2) === 'I-'
}

export function erOppgaveId(value: unknown): value is OppgaveId {
  return erInternOppgaveId(value) || erEksternOppgaveId(value)
}

export function erOppgaveIdNull(value: unknown): value is '0' {
  return value === '0'
}

export function oppgaveIdUtenPrefix(oppgaveId: OppgaveId): string {
  if (isString(oppgaveId) && oppgaveId.charAt(1) == '-') {
    return oppgaveId.substring(2)
  }
  return oppgaveId.toString()
}

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
  HØY = 'HØY',
  NORMAL = 'NORMAL',
  LAV = 'LAV',
}

export const OppgaveprioritetLabel: Record<Oppgaveprioritet, string> = {
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
  sakId?: string | number
}

export interface OppgaveV2 extends OppgaveBase {
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
}

export interface OppgaveKodeverk {
  kode: string
  term: string
}

export interface Oppgavekategorisering {
  oppgavetype: Oppgavetype
  behandlingstema?: OppgaveKodeverk
  behandlingstype?: OppgaveKodeverk
  tema: 'HJE' | string
}

export interface OppgaveBruker {
  fnr: string
  navn: Navn
  fulltNavn: string
  fødselsdato?: string
  alder?: number
  kommune?: Kommune
  bydel?: Bydel
  brukernummer?: string
}

export interface OppgaveInnsender {
  fnr: string
  navn: Navn
  fulltNavn: string
}

export interface OppgaveSak {
  sakId: string
  sakstype: Sakstype
  søknadId: string
  søknadGjelder: string
}

export interface OppgaveTotrinnskontroll {
  saksbehandlerId: string
  godkjennerId?: string
}

export interface GjelderAlternativerResponse {
  behandlingstemaKode: string
  behandlingstemaTerm: string
  alternativer: Array<{
    behandlingstemaKode: string
    behandlingstemaTerm: string
  }>
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
  oppgaver: OppgaveV2[]
  totalPages: number
}

export enum OppgaveTildelt {
  INGEN = 'INGEN',
  MEDARBEIDER = 'MEDARBEIDER',
  MEG = 'MEG',
}

export interface OppgaveSortState extends SortState {
  orderBy: 'fristFerdigstillelse' | 'opprettetTidspunkt' | 'fnr' | 'fødselsdato' | 'alder' | string
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
