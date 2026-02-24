import { Dokument, Hendelse, Journalpost, JournalpostStatusType } from '../../types/types.internal.ts'
import { lagTilfeldigDato, lagTilfeldigInteger } from './felles.ts'
import { lagTilfeldigFødselsnummer } from './fødselsnummer.ts'
import { lagTilfeldigNavn } from './navn.ts'

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

export function lagJournalpost(journalpostId: string): InsertJournalpost {
  const fnrInnsender = lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50))
  const journalpostOpprettetTid = lagTilfeldigDato(new Date().getFullYear()).toISOString()
  return {
    journalpostId,
    journalstatus: JournalpostStatusType.MOTTATT,
    journalpostOpprettetTid,
    fnrInnsender,
    tittel: 'Tilskudd ved kjøp av briller til barn',
    bruker: {
      fnr: fnrInnsender,
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
      brevkode: 'NAV 10-07.34',
    },
  ]
}
