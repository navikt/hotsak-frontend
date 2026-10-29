import { type OppgaveKodeverk } from '../../oppgave/oppgaveTypes.ts'
import {
  type Dokument,
  type Hendelse,
  type Journalpost,
  type JournalpostSak,
  JournalpostStatusType,
} from '../../types/types.internal.ts'
import { lagTilfeldigInteger, nåIso } from './felles.ts'
import { lagTilfeldigFødselsnummer } from './fødselsnummer.ts'
import { HJELPEMIDDEL_JOURNALPOST_IDS as HJELPEMIDDEL_IDS } from './journalpostKonstanter.ts'
import { lagTilfeldigNavn } from './navn.ts'

export const BARNEBRILLE_BREVKODE = 'NAV 10-07.34'
export const HJELPEMIDDEL_BREVKODE = 'NAV 10-07.03'
export const FUNKSJONSEVNE_BREVKODE = 'NAV 10-07.86'

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

interface LagJournalpostOptions {
  behandlingstema?: OppgaveKodeverk
  brukerFnr?: string
  avsenderFnr?: string
  kanal?: OppgaveKodeverk
  sak?: JournalpostSak | null
}

export function lagJournalpost(
  journalpostId: string,
  tittel: string,
  { behandlingstema, brukerFnr, avsenderFnr, kanal, sak }: LagJournalpostOptions = {}
): InsertJournalpost {
  const fnrBruker = brukerFnr ?? lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50))
  const fnrInnsender = avsenderFnr ?? fnrBruker
  const brukerNavn = lagTilfeldigNavn()
  const journalpostOpprettetTid = nåIso()
  const journalposttyper = ['I', 'U', 'N'] as const
  return {
    journalpostId,
    tema: { kode: 'HJE', term: 'Hjelpemidler' },
    ...(behandlingstema ? { behandlingstema } : {}),
    kanal: kanal ?? { kode: 'SKAN_IM', term: 'Skanning Iron Mountain' },
    journalposttype: journalposttyper[lagTilfeldigInteger(0, 2)],
    journalstatus: JournalpostStatusType.MOTTATT,
    journalpostOpprettetTid,
    fnrInnsender,
    fnrBruker,
    ...(sak !== undefined ? { sak: sak === null ? null : { ...sak } } : {}),
    tittel: tittel,
    bruker: {
      fnr: fnrBruker,
      navn: brukerNavn,
    },
    innsender: {
      fnr: fnrInnsender,
      navn: fnrInnsender === fnrBruker ? brukerNavn : lagTilfeldigNavn(),
    },
  }
}

export function lagDokumenter(journalpostId: string): InsertDokument[] {
  return [
    {
      journalpostId,
      tittel: 'NAV 10-07.34: Tilskudd ved kjøp av briller til barn',
      brevkode: BARNEBRILLE_BREVKODE,
      logiskeVedlegg: [],
    },
    {
      journalpostId,
      tittel: 'Brilleseddel',
      brevkode: BARNEBRILLE_BREVKODE,
      logiskeVedlegg: [],
    },
    {
      journalpostId,
      tittel: 'Kvittering fra optiker',
      brevkode: BARNEBRILLE_BREVKODE,
      logiskeVedlegg: [],
    },
  ]
}

export function lagHjelpemiddelDokumenter(journalpostId: string): InsertDokument[] {
  return [
    {
      journalpostId,
      tittel: 'NAV 10-07.03: Søknad om hjelpemidler',
      brevkode: HJELPEMIDDEL_BREVKODE,
      logiskeVedlegg: [],
    },
  ]
}

export function lagFunksjonsevneDokumenter(journalpostId: string): InsertDokument[] {
  return [
    {
      journalpostId,
      tittel: 'NAV 10-07.86: Søknad om hjelpemiddel til kognisjon, kommunikasjon og lese- og skrivevansker',
      brevkode: FUNKSJONSEVNE_BREVKODE,
      logiskeVedlegg: [
        { vedleggId: `${journalpostId}-1`, tittel: 'Annen dokumentasjon' },
        { vedleggId: `${journalpostId}-2`, tittel: 'Uttalelse fra fagperson om diagnose og funksjonsevne' },
      ],
    },
  ]
}
