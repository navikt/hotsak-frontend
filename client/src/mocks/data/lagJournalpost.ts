import { OppgaveKodeverk } from '../../oppgave/oppgaveTypes.ts'
import { Dokument, Hendelse, Journalpost, JournalpostStatusType } from '../../types/types.internal.ts'
import { lagTilfeldigDato, lagTilfeldigInteger } from './felles.ts'
import { lagTilfeldigFødselsnummer } from './fødselsnummer.ts'
import { HJELPEMIDDEL_JOURNALPOST_IDS as HJELPEMIDDEL_IDS } from './journalpostKonstanter.ts'
import { lagTilfeldigNavn } from './navn.ts'

export const BARNEBRILLE_BREVKODE = 'NAV 10-07.34'
export const HJELPEMIDDEL_BREVKODE = 'NAV 10-07.03'

/** Journalpost-IDer som tilhører hjelpemiddelsaker (ikke barnebriller). */
export const HJELPEMIDDEL_JOURNALPOST_IDS = HJELPEMIDDEL_IDS

export type LagretJournalpost = Omit<Journalpost, 'dokumenter'>
export type InsertJournalpost = LagretJournalpost

export interface LagretDokument extends Dokument {
  journalpostId: string
}
export type InsertDokument = Omit<LagretDokument, 'dokumentId'>

export interface LagretHendelse extends Hendelse {
  journalpostId: string
}
export type InsertHendelse = Omit<LagretHendelse, 'id'>

export function lagJournalpost(
  journalpostId: string,
  tittel: string = 'Tilskudd ved kjøp av briller til barn',
  behandlingstema: OppgaveKodeverk = { kode: 'ab0420', term: 'Briller til barn' }
): InsertJournalpost {
  const fnrInnsender = lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50))
  const journalpostOpprettetTid = lagTilfeldigDato(new Date().getFullYear()).toISOString()
  const journalposttyper = ['I', 'U', 'N'] as const
  return {
    journalpostId,
    tema: { kode: 'HJE', term: 'Hjelpemidler' },
    behandlingstema: behandlingstema,
    kanal: { kode: 'SKAN_IM', term: 'Skanning Iron Mountain' },
    journalposttype: journalposttyper[lagTilfeldigInteger(0, 2)],
    journalstatus: JournalpostStatusType.MOTTATT,
    journalpostOpprettetTid,
    fnrInnsender,
    tittel: tittel,
    bruker: {
      fnr: lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50)),
      navn: lagTilfeldigNavn(),
    },
    innsender: {
      fnr: fnrInnsender,
      navn: lagTilfeldigNavn(),
    },
  }
}

export function lagDokumenter(journalpostId: string): InsertDokument[] {
  return [
    {
      journalpostId,
      tittel: 'NAV 10-07.34: Tilskudd ved kjøp av briller til barn',
      brevkode: BARNEBRILLE_BREVKODE,
    },
    {
      journalpostId,
      tittel: 'Brilleseddel',
      brevkode: BARNEBRILLE_BREVKODE,
    },
    {
      journalpostId,
      tittel: 'Kvittering fra optiker',
      brevkode: BARNEBRILLE_BREVKODE,
    },
  ]
}

export function lagHjelpemiddelDokumenter(journalpostId: string): InsertDokument[] {
  return [
    {
      journalpostId,
      tittel: 'NAV 10-07.03: Søknad om hjelpemidler',
      brevkode: HJELPEMIDDEL_BREVKODE,
    },
  ]
}
