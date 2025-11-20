import { addBusinessDays, parseISO } from 'date-fns'

import { Oppgaveprioritet, Oppgavestatus, Oppgavetype, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../../types/types.internal.ts'
import { enheter } from './enheter.ts'
import { LagretJournalpost } from './lagJournalpost.ts'
import { type LagretHjelpemiddelsak, type LagretSak } from './lagSak.ts'

export type LagretOppgave = OppgaveV2
export type InsertOppgave = LagretOppgave

export interface OppgaveKategorisering {
  tema: 'HJE'
  oppgavetype: Oppgavetype
  behandlingstema: string
  behandlingstype: string
}

export function lagOppgave(sak: LagretSak, kategorisering: OppgaveKategorisering): InsertOppgave {
  const sakId = sak.sakId
  return {
    ...kategorisering,
    oppgaveId: `E-${sakId}`,
    versjon: 1,
    sakId,
    sakstype: sak.sakstype,
    oppgavestatus: Oppgavestatus.OPPRETTET,
    gjelder: sak.sakstype === Sakstype.SØKNAD ? 'Digital søknad' : 'Bestilling', // fixme
    beskrivelse: sak.søknadGjelder,
    prioritet: (sak as LagretHjelpemiddelsak)?.hast ? Oppgaveprioritet.HØY : Oppgaveprioritet.NORMAL,
    tildeltEnhet: sak.enhet,
    tildeltSaksbehandler: sak.saksbehandler,
    aktivDato: sak.opprettet,
    behandlesAvApplikasjon: 'HOTSAK',
    fristFerdigstillelse: addBusinessDays(parseISO(sak.opprettet), 60).toISOString(),
    opprettetTidspunkt: sak.opprettet,
    endretTidspunkt: sak.opprettet,
    fnr: sak.bruker.fnr,
    bruker: { fnr: sak.bruker.fnr, navn: sak.bruker.navn },
    mappeId: undefined, // fixme
    mappenavn: undefined, // fixme
  }
}

export function lagJournalføringsoppgave(journalføring: LagretJournalpost): InsertOppgave {
  const journalpostId = journalføring.journalpostId
  return {
    oppgaveId: `I-${journalpostId}`,
    versjon: 1,
    oppgavetype: Oppgavetype.JOURNALFØRING,
    oppgavestatus: Oppgavestatus.OPPRETTET,
    tema: 'HJE',
    behandlingstema: 'Briller til barn',
    behandlingstype: 'Søknad',
    gjelder: 'Briller til barn',
    beskrivelse: journalføring.tittel,
    prioritet: Oppgaveprioritet.NORMAL,
    tildeltEnhet: enheter.agder,
    tildeltSaksbehandler: undefined,
    aktivDato: journalføring.journalpostOpprettetTid,
    journalpostId: journalpostId,
    fristFerdigstillelse: addBusinessDays(parseISO(journalføring.journalpostOpprettetTid), 5).toISOString(),
    opprettetTidspunkt: journalføring.journalpostOpprettetTid,
    endretTidspunkt: journalføring.journalpostOpprettetTid,
    fnr: journalføring.bruker!.fnr,
    bruker: { fnr: journalføring.bruker!.fnr, navn: journalføring.bruker!.navn! },
    mappeId: undefined, // fixme
    mappenavn: undefined, // fixme
  }
}
