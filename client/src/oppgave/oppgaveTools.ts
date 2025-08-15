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
    sakId: oppgave.sakId,
    oppgavetype: Oppgavetype.BEHANDLE_SAK, // fixme
    oppgavestatus: oppgavestatusByOppgaveStatusType[oppgave.status],
    tema: 'HJE',
    gjelder: oppgave.sakstype,
    beskrivelse: oppgave.beskrivelse,
    prioritet: oppgave.hast ? Oppgaveprioritet.HØY : Oppgaveprioritet.NORMAL,
    tildeltEnhet: oppgave.enhet,
    tildeltSaksbehandler: oppgave.saksbehandler,
    aktivDato: oppgave.mottatt,
    behandlesAvApplikasjon: 'HOTSAK',
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
    },
  }
}

// const oppgavetypeByOppgaveStatusType: Record<OppgaveStatusType, Oppgavestatus> = {}

const oppgavestatusByOppgaveStatusType: Record<OppgaveStatusType, Oppgavestatus> = {
  ALLE: Oppgavestatus.OPPRETTET, // fixme
  AVSLÅTT: Oppgavestatus.FERDIGSTILT,
  AVVENTER_DOKUMENTASJON: Oppgavestatus.UNDER_BEHANDLING,
  AVVENTER_GODKJENNER: Oppgavestatus.OPPRETTET,
  AVVENTER_JOURNALFORING: Oppgavestatus.OPPRETTET, // fixme
  AVVENTER_SAKSBEHANDLER: Oppgavestatus.OPPRETTET,
  AVVIST: Oppgavestatus.FERDIGSTILT,
  FERDIGSTILT: Oppgavestatus.FERDIGSTILT,
  HENLAGT: Oppgavestatus.FERDIGSTILT,
  INNVILGET: Oppgavestatus.FERDIGSTILT,
  RETURNERT: Oppgavestatus.OPPRETTET, // fixme
  SENDT_GOSYS: Oppgavestatus.FERDIGSTILT,
  TILDELT_GODKJENNER: Oppgavestatus.UNDER_BEHANDLING,
  TILDELT_SAKSBEHANDLER: Oppgavestatus.UNDER_BEHANDLING,
  VEDTAK_FATTET: Oppgavestatus.FERDIGSTILT,
}
