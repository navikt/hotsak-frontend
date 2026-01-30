import { addBusinessDays, parseISO } from 'date-fns'

import {
  type Oppgavekategorisering,
  Oppgaveprioritet,
  Oppgavestatus,
  Oppgavetype,
  type OppgaveV2,
  Statuskategori,
} from '../../oppgave/oppgaveTypes.ts'
import { beregnAlder } from '../../utils/dato.ts'
import { formaterNavn } from '../../utils/formater.ts'
import { enheter } from './enheter.ts'
import { LagretJournalpost } from './lagJournalpost.ts'
import { type LagretHjelpemiddelsak, type LagretSak } from './lagSak.ts'

export type LagretOppgave = OppgaveV2
export type InsertOppgave = LagretOppgave

export function lagOppgave(sak: LagretSak, kategorisering: Oppgavekategorisering): InsertOppgave {
  const sakId = sak.sakId
  const bruker = sak.bruker
  return {
    oppgaveId: `E-${sakId}`,
    versjon: 1,
    statuskategori: Statuskategori.ÅPEN,
    oppgavestatus: Oppgavestatus.OPPRETTET,
    prioritet: (sak as LagretHjelpemiddelsak)?.hast ? Oppgaveprioritet.HØY : Oppgaveprioritet.NORMAL,
    kategorisering,
    beskrivelse: sak.søknadGjelder,
    tildeltEnhet: sak.enhet,
    tildeltSaksbehandler: sak.saksbehandler,
    aktivDato: sak.opprettet,
    fristFerdigstillelse: addBusinessDays(parseISO(sak.opprettet), 60).toISOString(),
    opprettetTidspunkt: sak.opprettet,
    endretTidspunkt: sak.opprettet,
    fnr: bruker.fnr,
    bruker: {
      fnr: bruker.fnr,
      navn: bruker.navn,
      fulltNavn: formaterNavn(bruker.navn),
      fødselsdato: bruker.fødselsdato,
      alder: beregnAlder(bruker.fødselsdato),
      kommune: bruker.kommune,
      bydel: bruker.bydel,
    },
    innsender: {
      fnr: sak.innsender.fnr,
      navn: sak.innsender.navn,
      fulltNavn: formaterNavn(sak.innsender.navn),
    },
    sakId,
    sak: { sakId: sak.sakId, sakstype: sak.sakstype, søknadId: '', søknadGjelder: sak.søknadGjelder },
    behandlesAvApplikasjon: 'HOTSAK',
    mappeId: undefined, // fixme
    mappenavn: undefined, // fixme
  }
}

export function lagJournalføringsoppgave(journalføring: LagretJournalpost): InsertOppgave {
  const journalpostId = journalføring.journalpostId
  return {
    oppgaveId: `I-${journalpostId}`,
    versjon: 1,
    statuskategori: Statuskategori.ÅPEN,
    oppgavestatus: Oppgavestatus.OPPRETTET,
    prioritet: Oppgaveprioritet.NORMAL,
    kategorisering: {
      oppgavetype: Oppgavetype.JOURNALFØRING,
      behandlingstema: { kode: '', term: 'Briller til barn' },
      behandlingstype: { kode: '', term: 'Søknad' },
      tema: 'HJE',
    },
    beskrivelse: journalføring.tittel,
    tildeltEnhet: enheter.agder,
    tildeltSaksbehandler: undefined,
    aktivDato: journalføring.journalpostOpprettetTid,
    fristFerdigstillelse: addBusinessDays(parseISO(journalføring.journalpostOpprettetTid), 5).toISOString(),
    opprettetTidspunkt: journalføring.journalpostOpprettetTid,
    endretTidspunkt: journalføring.journalpostOpprettetTid,
    fnr: journalføring.bruker!.fnr,
    bruker: {
      fnr: journalføring.bruker!.fnr,
      navn: journalføring.bruker!.navn!,
      fulltNavn: formaterNavn(journalføring.bruker!.navn),
    },
    journalpostId: journalpostId,
    mappeId: undefined, // fixme
    mappenavn: undefined, // fixme
  }
}
