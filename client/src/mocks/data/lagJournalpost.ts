import {
  Dokument,
  Hendelse,
  Journalpost,
  JournalpostStatusType,
  Oppgavestatus,
  Oppgavetype,
} from '../../types/types.internal.ts'
import { lagTilfeldigFødselsnummer } from './fødselsnummer.ts'
import { lagTilfeldigInteger } from './felles.ts'
import { lagTilfeldigNavn } from './navn.ts'
import { OppgavePrioritet } from '../../types/experimentalTypes.ts'
import { enheter } from './enheter.ts'

export type LagretJournalpost = Omit<Journalpost, 'dokumenter'>
export type InsertJournalpost = Omit<LagretJournalpost, 'journalpostId'>

export interface LagretDokument extends Dokument {
  journalpostId: string
}
export type InsertDokument = Omit<LagretDokument, 'dokumentId'>

export interface LagretHendelse extends Hendelse {
  journalpostId: string
}
export type InsertHendelse = Omit<LagretHendelse, 'id'>

export function lagJournalpost(): InsertJournalpost {
  const fnrInnsender = lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50))
  const now = new Date()
  return {
    journalstatus: JournalpostStatusType.MOTTATT,
    journalpostOpprettetTid: now.toISOString(),
    fnrInnsender,
    tittel: 'Tilskudd ved kjøp av briller til barn',
    // enhet: enheter.agder,
    bruker: {
      fnr: fnrInnsender,
      navn: lagTilfeldigNavn(),
    },
    innsender: {
      fnr: fnrInnsender,
      navn: lagTilfeldigNavn(),
    },
    oppgave: {
      tema: 'HJE',
      oppgaveId: 'I-1234', // `I-${journalpostId}`, fixme
      oppgavetype: Oppgavetype.JOURNALFØRING,
      oppgavestatus: Oppgavestatus.OPPRETTET,
      prioritet: OppgavePrioritet.NORMAL,
      tildeltEnhet: enheter.agder,
      aktivDato: now.toISOString(),
      versjon: 1,
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
    /*
    {
      journalpostId,

      tittel: 'Ettersendelse: Skikkelig lang tittel som er ganske lang og ikke så veldig kort kan du på en måte si',
      brevkode: 'NAV 10-07.34',
    },
    {
      journalpostId,

      tittel: 'Ettersendelse: Brilleseddel',
      brevkode: 'NAV 10-07.34',
    },
    */
  ]
}
