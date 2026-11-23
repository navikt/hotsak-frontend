import { subYears } from 'date-fns'
import { intervalString, type IntervalString, tilLocalDateString } from '../../utils/dato'

import { type Oppgave, OppgavetypeLabel } from '../../oppgave/oppgaveTypes'
import { type Journalpost } from '../../types/types.internal'

export const OppgaverOgDokumenterTabs = {
  OPPGAVER: 'OPPGAVER',
  DOKUMENTER: 'DOKUMENTER',
} as const

export const OppgaverOgDokumenterFilter = {
  SISTE_2_UKER: 'siste2uker',
  SISTE_6_MND: 'siste6mnd',
  ALLE: 'alle',
} as const

export type OppgaverOgDokumenterFilterValue =
  (typeof OppgaverOgDokumenterFilter)[keyof typeof OppgaverOgDokumenterFilter]

function periodeForFilter(filter: OppgaverOgDokumenterFilterValue): { fra: Date; til: Date } | undefined {
  const now = new Date()
  switch (filter) {
    case OppgaverOgDokumenterFilter.SISTE_2_UKER: {
      const fra = new Date(now)
      fra.setDate(fra.getDate() - 14)
      return { fra, til: now }
    }
    case OppgaverOgDokumenterFilter.SISTE_6_MND: {
      const fra = new Date(now)
      const dag = fra.getDate()
      fra.setDate(1)
      fra.setMonth(fra.getMonth() - 6)
      fra.setDate(Math.min(dag, new Date(fra.getFullYear(), fra.getMonth() + 1, 0).getDate()))
      return { fra, til: now }
    }
    case OppgaverOgDokumenterFilter.ALLE:
      return { fra: subYears(now, 10), til: now }
  }
}

export function opprettetIntervallForFilter(filter: OppgaverOgDokumenterFilterValue): IntervalString | undefined {
  const periode = periodeForFilter(filter)
  return periode && intervalString(periode.fra.toISOString(), periode.til.toISOString())
}

export function datoIntervallForFilter(filter: OppgaverOgDokumenterFilterValue): {
  fraDato?: string
  tilDato?: string
} {
  const periode = periodeForFilter(filter)
  if (!periode) return {}
  return { fraDato: tilLocalDateString(periode.fra), tilDato: tilLocalDateString(periode.til) }
}

export type OppgaverOgDokumenterTab = keyof typeof OppgaverOgDokumenterTabs

export interface OppgaverOgDokumenterState {
  currentTab: OppgaverOgDokumenterTab
  filter: (typeof OppgaverOgDokumenterFilter)[keyof typeof OppgaverOgDokumenterFilter]
}

export const initialState: OppgaverOgDokumenterState = {
  currentTab: OppgaverOgDokumenterTabs.OPPGAVER,
  filter: 'siste2uker',
}

const visDatoFormat = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'short' })

function formaterVisDato(dato: string): string {
  return visDatoFormat.format(new Date(dato))
}

function matcherSøk(søk: string, ...felter: Array<string | null | undefined>): boolean {
  const ord = søk.trim().toLocaleLowerCase('nb-NO').split(/\s+/).filter(Boolean)
  if (ord.length === 0) return true
  const tekst = felter.filter(Boolean).join(' ').toLocaleLowerCase('nb-NO')
  return ord.every((o) => tekst.includes(o))
}

export function filtrerOppgaver(oppgaver: ReadonlyArray<Oppgave>, søk: string): ReadonlyArray<Oppgave> {
  if (!søk.trim()) return oppgaver
  return oppgaver.filter((oppgave) =>
    matcherSøk(
      søk,
      oppgave.sakId,
      oppgave.eksternSakId,
      OppgavetypeLabel[oppgave.kategorisering.oppgavetype],
      oppgave.ferdigstiltTidspunkt ? formaterVisDato(oppgave.ferdigstiltTidspunkt) : 'åpen',
      oppgave.kategorisering.behandlingstype?.term,
      oppgave.ferdigstiltTidspunkt
    )
  )
}

export function filtrerJournalposter(
  journalposter: ReadonlyArray<Journalpost>,
  søk: string
): ReadonlyArray<Journalpost> {
  if (!søk.trim()) return journalposter
  return journalposter.filter((journalpost) =>
    matcherSøk(
      søk,
      journalpost.tittel,
      journalpost.journalpostId,
      journalpost.sak?.fagsakId,
      journalpost.sakId,
      formaterVisDato(journalpost.journalpostOpprettetTid),
      journalpost.journalposttype === 'I' ? 'inngående' : journalpost.journalposttype === 'U' ? 'utgående' : 'notat',
      journalpost.behandlingstema?.term,
      ...journalpost.dokumenter.map((dokument) => dokument.tittel)
    )
  )
}
