import type { Enhet, Hast, Navn, OppgaveStatusType, Saksbehandler, Sakstype } from '../types/types.internal'

/**
 * Oppgaven er kun opprettet i Hotsak-tabellen `oppgave_v1`.
 */
type InternOppgaveId = `I-${string | number}`

/**
 * Oppgaven er opprettet i felles oppgaveløsning.
 */
type EksternOppgaveId = `E-${string | number}`

/**
 * Vi har kun en sak. Siffer etter `S-` er `sakId`.
 */
type SakOppgaveId = `S-${string | number}`

/**
 * Vi har tre ulike typer `OppgaveId`. Typen forteller oss hvor oppgaven er lagret.
 */
export type OppgaveId = InternOppgaveId | EksternOppgaveId | SakOppgaveId

function harPrefix(prefix: string, value: unknown): value is string {
  if (!(value && typeof value === 'string')) return false
  return value.substring(0, 2) === prefix
}

export function erInternOppgaveId(value: unknown): value is InternOppgaveId {
  return harPrefix('I-', value)
}

export function erEksternOppgaveId(value: unknown): value is EksternOppgaveId {
  return harPrefix('E-', value)
}

export function erSakOppgaveId(value: unknown): value is SakOppgaveId {
  return harPrefix('S-', value)
}

export function oppgaveIdUtenPrefix(oppgaveId: OppgaveId): string {
  return oppgaveId.substring(2)
}

export enum Oppgavetype {
  JOURNALFØRING = 'JOURNALFØRING',
  BEHANDLE_SAK = 'BEHANDLE_SAK',
  GODKJENNE_VEDTAK = 'GODKJENNE_VEDTAK',
  BEHANDLE_UNDERKJENT_VEDTAK = 'BEHANDLE_UNDERKJENT_VEDTAK',
}

export enum Oppgavestatus {
  OPPRETTET = 'OPPRETTET',
  ÅPNET = 'ÅPNET',
  UNDER_BEHANDLING = 'UNDER_BEHANDLING',
  FERDIGSTILT = 'FERDIGSTILT',
  FEILREGISTRERT = 'FEILREGISTRERT',
}

export enum Statuskategori {
  ÅPEN = 'ÅPEN',
  AVSLUTTET = 'AVSLUTTET',
}

export const OppgavestatusLabel = new Map<string, string>([
  [Oppgavestatus.OPPRETTET, 'Mottatt'],
  [Oppgavestatus.ÅPNET, 'Mottatt'],
  [Oppgavestatus.UNDER_BEHANDLING, 'Under journalføring'],
  [Oppgavestatus.FERDIGSTILT, 'Journalført'],
  [Oppgavestatus.FEILREGISTRERT, 'Feilregistrert'],
])

export interface OppgaveBase {
  oppgaveId: OppgaveId
  versjon: number

  /**
   * NB! Journalføringsoppgaver har ikke `sakId`.
   */
  sakId?: string | number
}

export interface OppgaveApiOppgave extends OppgaveBase {
  oppgavetype: Oppgavetype
  oppgavestatus: Oppgavestatus
  tema: string
  behandlingstema?: string | null
  behandlingstype?: string | null
  gjelder?: string | null
  beskrivelse?: string
  prioritet: OppgavePrioritet
  tildeltEnhet: Enhet
  tildeltSaksbehandler?: Saksbehandler
  opprettetAv?: string
  opprettetAvEnhet?: Enhet
  endretAv?: string
  endretAvEnhet?: Enhet
  aktivDato: string
  journalpostId?: string
  behandlesAvApplikasjon?: string
  mappeId?: string
  fristFerdigstillelse?: string
  opprettetTidspunkt?: string
  endretTidspunkt?: string
  ferdigstiltTidspunkt?: string
  fnr?: string
  bruker?: OppgaveApiOppgaveBruker
}

export interface OppgaveApiOppgaveBruker {
  fnr: string
  navn?: Navn
}

export enum OppgavePrioritet {
  HØY = 'HØY',
  NORMAL = 'NORMAL',
  LAV = 'LAV',
}

export interface OppgaveApiResponse {
  oppgaver: OppgaveApiOppgave[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
}

export enum OppgaveGjelderFilter {
  BESTILLING = 'BESTILLING',
  DIGITAL_SØKNAD = 'DIGITAL_SØKNAD',
  HASTESØKNAD = 'HASTESØKNAD',
}

export enum TildeltFilter {
  ALLE = 'ALLE',
  INGEN = 'INGEN',
  MEG = 'MEG',
}

export interface OppgaveFilterType {
  key: string
  label: string
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

export interface OppgaverResponse {
  oppgaver: OppgaveApiOppgave[]
  totalElements: number
}

/**
 * @deprecated
 */
export interface Oppgave extends OppgaveBase {
  sakId: string
  sakstype: Sakstype
  status: OppgaveStatusType
  statusEndret: string
  beskrivelse: string
  mottatt: string
  innsender: string
  bruker: OppgaveBruker
  enhet: Enhet
  saksbehandler?: Saksbehandler
  kanTildeles: boolean
  hast?: Hast
}

export interface OppgaveBruker extends Navn {
  fnr: string
  funksjonsnedsettelser: string[]
  bosted: string
}
