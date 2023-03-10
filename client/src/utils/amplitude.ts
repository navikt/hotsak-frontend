import amplitude from 'amplitude-js'

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
}

export const initAmplitude = (): void => {
  if (amplitude) {
    amplitude.getInstance().init('default', '', {
      apiEndpoint: 'amplitude.nav.no/collect-auto',
      saveEvents: false,
      includeUtm: true,
      includeReferrer: true,
      platform: window.location.toString(),
    })
  }
}

export function logAmplitudeEvent(eventName: amplitude_taxonomy, data?: any): void {
  if (import.meta.env.NODE_ENV === 'test') {
    return
  }
  setTimeout(() => {
    data = {
      app: 'hotsak-frontend',
      team: 'teamdigihot',
      ...data,
    }
    try {
      if (amplitude) {
        amplitude.getInstance().logEvent(eventName, data)
      } else {
        console.debug(eventName, data)
      }
    } catch (error) {
      console.error(error)
    }
  })
}
