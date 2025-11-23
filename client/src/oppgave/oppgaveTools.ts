import { OppgaveStatusType } from '../types/types.internal.ts'
import { Oppgaveprioritet, Oppgavestatus, Oppgavetype, OppgaveV1, OppgaveV2 } from './oppgaveTypes.ts'

/**
 * Konverter oppgave til ny modell.
 *
 * @param oppgave
 */
export function oppgaveV1ToV2(oppgave: OppgaveV1): OppgaveV2 {
  return {
    oppgaveId: oppgave.oppgaveId,
    versjon: oppgave.versjon,
    oppgavestatus: oppgavestatusByOppgaveStatusType[oppgave.status],
    prioritet: oppgave.hast ? Oppgaveprioritet.HØY : Oppgaveprioritet.NORMAL,
    kategorisering: {
      oppgavetype: utledOppgavetypeForOppgave(oppgave),
      tema: 'HJE',
    },
    beskrivelse: oppgave.beskrivelse,
    tildeltEnhet: oppgave.enhet,
    tildeltSaksbehandler: oppgave.saksbehandler,
    aktivDato: oppgave.mottatt,
    opprettetTidspunkt: oppgave.mottatt,
    endretTidspunkt: oppgave.statusEndret,
    fnr: oppgave.bruker.fnr,
    bruker: {
      fnr: oppgave.bruker.fnr,
      navn: {
        fornavn: oppgave.bruker.fornavn,
        mellomnavn: oppgave.bruker.mellomnavn,
        etternavn: oppgave.bruker.etternavn,
      },
      fulltNavn: '',
    },
    sakId: oppgave.sakId,
    sak: {
      sakId: oppgave.sakId,
      sakstype: oppgave.sakstype,
      søknadId: '',
      søknadGjelder: oppgave.beskrivelse,
    },
    behandlesAvApplikasjon: 'HOTSAK',
  }
}

function utledOppgavetypeForOppgave(oppgave: OppgaveV1): Oppgavetype {
  switch (oppgave.status) {
    case OppgaveStatusType.AVVENTER_GODKJENNER:
    case OppgaveStatusType.TILDELT_GODKJENNER:
      return Oppgavetype.GODKJENNE_VEDTAK
    case OppgaveStatusType.RETURNERT: // Dette vil ikke holde siden status endres når saksbehandler1 tar oppgaven
      return Oppgavetype.BEHANDLE_UNDERKJENT_VEDTAK
    default:
      return Oppgavetype.BEHANDLE_SAK
  }
}

const oppgavestatusByOppgaveStatusType: Record<OppgaveStatusType, Oppgavestatus> = {
  ALLE: Oppgavestatus.OPPRETTET, // Skjer ikke i praksis da ingen oppgaver i lista har denne statusen
  AVSLÅTT: Oppgavestatus.FERDIGSTILT,
  AVVENTER_DOKUMENTASJON: Oppgavestatus.UNDER_BEHANDLING,
  AVVENTER_GODKJENNER: Oppgavestatus.OPPRETTET,
  AVVENTER_JOURNALFORING: Oppgavestatus.OPPRETTET, // Skjer ikke i praksis da ingen oppgaver i lista har denne statusen
  AVVENTER_SAKSBEHANDLER: Oppgavestatus.OPPRETTET,
  AVVIST: Oppgavestatus.FERDIGSTILT,
  FERDIGSTILT: Oppgavestatus.FERDIGSTILT,
  HENLAGT: Oppgavestatus.FERDIGSTILT,
  INNVILGET: Oppgavestatus.FERDIGSTILT,
  RETURNERT: Oppgavestatus.OPPRETTET,
  SENDT_GOSYS: Oppgavestatus.FERDIGSTILT,
  TILDELT_GODKJENNER: Oppgavestatus.UNDER_BEHANDLING,
  TILDELT_SAKSBEHANDLER: Oppgavestatus.UNDER_BEHANDLING,
  VEDTAK_FATTET: Oppgavestatus.FERDIGSTILT,
}
