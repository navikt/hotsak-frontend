import { logDebug } from '../utvikling/logDebug'

export enum amplitude_taxonomy {
  OPPGAVELISTE_BYTT_TAB = 'byttet tab i oppgaveliste',
  OPPGAVELISTE_OPPDATERT = 'oppdaterte oppgaveliste',
  SAKSBILDE_BYTT_TAB = 'byttet tab i saksbilde',
  SOKNAD_INNVILGET = 'innvilget søknad',
  SOKNAD_OVERFORT_TIL_GOSYS = 'overført søknad til Gosys',
  SAK_OVERTATT = 'sak overtatt av ny saksbehandler',
  BESTILLING_OVERTATT = 'bestilling overtatt av ny saksbehandler',
  NAVIGASJON_ETTER_HENDELSE = 'neste navigasjon foretatt etter hendelse',
  CLIENT_INFO = 'client info',
  SAK_STARTET_FRA_OPPGAVELISTE = 'sak startet fra oppgaveliste',
  SAK_STARTET_FRA_SAK = 'sak startet fra sak',
  OPPGAVE_STARTET_FRA_OPPGAVELISTE = 'oppgave startet fra oppgaveliste',
  OPPGAVE_STARTET_FRA_SAK = 'oppgave startet fra sak',
  SAK_FRIGITT = 'sak frigitt',
  ENDRINGSLOGG_APNET = 'endringslogg åpnet',
  ENDRINGSLOGGINNSLAG_LEST = 'endringslogginnslag lest',
  PERSONSØK = 'søkt etter person',
  PERSONOVERSIKT = 'navigert til personoversikt',
  BESTILLING_STARTET_FRA_OPPGAVELISTE = 'bestilling startet fra oppgaveliste',
  BESTILLING_STARTET_FRA_BESTILLINGSBILDE = 'bestilling startet fra bestillingsbilde',
  BESTILLING_FERDIGSTILT = 'godkjent bestilling',
  BESTILLING_AVVIST = 'avvist bestilling hotsak',
  TOTRINNSKONTROLL_GODKJENT = 'totrinnskontroll godkjent',
  FORTSETT_BEHANDLING_FRA_OPPGAVELISTE = 'fortsetter behandling fra oppgaveliste',
  FORTSETT_BEHANDLING_FRA_SAK = 'fortsetter behandling fra sak',
  FINN_HJELPEMIDDEL_LINK_BESØKT = 'viser produkt i FinnHjelpemiddel',
  KOPIKNAPP_BRUKT = 'kopiknapp brukt',
}

export function logAmplitudeEvent(eventName: amplitude_taxonomy, data?: Record<string, any>): void {
  logDebug('eventName: %o, data: %o', eventName, data)
}
