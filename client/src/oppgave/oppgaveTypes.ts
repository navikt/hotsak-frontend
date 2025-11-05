import type { SortState } from '@navikt/ds-react'

import type { PageResponse } from '../felleskomponenter/Page.ts'
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
  sakstype?: Sakstype
}

export interface OppgaveV2 extends OppgaveBase {
  oppgavetype: Oppgavetype
  oppgavestatus: Oppgavestatus
  tema: string
  behandlingstema?: string
  behandlingstype?: string
  gjelder?: string | null
  beskrivelse?: string
  prioritet: Oppgaveprioritet
  tildeltEnhet: Enhet
  tildeltSaksbehandler?: Saksbehandler
  opprettetAv?: string
  opprettetAvEnhet?: Enhet
  endretAv?: string
  endretAvEnhet?: Enhet
  aktivDato: string
  journalpostId?: string
  behandlesAvApplikasjon?: string
  fristFerdigstillelse?: string
  opprettetTidspunkt?: string
  endretTidspunkt?: string
  ferdigstiltTidspunkt?: string
  fnr?: string
  bruker?: OppgaveBrukerV2
  isPåVent?: boolean
  mappeId?: string
  mappenavn?: string
}

export interface OppgaveBrukerV2 {
  fnr: string
  navn?: Navn
}

export interface FinnOppgaverResponse extends PageResponse {
  oppgaver: OppgaveV2[]
  totalPages: number
}

export enum OppgaveGjelderFilter {
  BESTILLING = 'BESTILLING',
  DIGITAL_SØKNAD = 'DIGITAL_SØKNAD',
  HASTESØKNAD = 'HASTESØKNAD',
}

export const OppgaveGjelderFilterLabel: Record<OppgaveGjelderFilter, string> = {
  BESTILLING: 'Bestilling',
  DIGITAL_SØKNAD: 'Digital søknad',
  HASTESØKNAD: 'Digital hastesøknad',
}

export enum OppgaveTildeltFilter {
  ALLE = 'ALLE',
  INGEN = 'INGEN',
  MEG = 'MEG',
}

export interface OppgaveSortState extends SortState {
  orderBy: 'fristFerdigstillelse' | 'opprettetTidspunkt' | 'fnr' | string
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

/**
 * @deprecated Skal erstattes med `OppgaveV2`.
 */
export interface OppgaveV1 extends OppgaveBase {
  sakId: string
  sakstype: Sakstype
  status: OppgaveStatusType
  statusEndret: string
  beskrivelse: string
  mottatt: string
  innsender: string
  bruker: OppgaveBrukerV1
  enhet: Enhet
  saksbehandler?: Saksbehandler
  kanTildeles: boolean
  hast?: Hast
}

/**
 * @deprecated Skal erstattes med `OppgaveBrukerV2`.
 */
export interface OppgaveBrukerV1 extends Navn {
  fnr: string
  funksjonsnedsettelser: string[]
  bosted: string
}
