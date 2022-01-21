import amplitude from 'amplitude-js'

export enum amplitude_taxonomy {
  OPPGAVELISTE_BYTT_TAB = 'byttet tab i oppgaveliste',
  SAKSBILDE_BYTT_TAB = 'byttet tab i saksbilde',
  SOKNAD_INNVILGET = 'innvilget søknad',
  SOKNAD_OVERFORT_TIL_GOSYS = 'overført søknad til Gosys',
  SAK_OVERTATT = 'sak overtatt av ny saksbehandler',
  NAVIGASJON_ETTER_HENDELSE = 'neste navigasjon foretatt etter hendelse',
}

export const initAmplitude = () => {
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

export function logAmplitudeEvent(eventName: amplitude_taxonomy, data?: any) {
  setTimeout(() => {
    data = {
      app: 'hotsak-frontend',
      team: 'teamdigihot',
      ...data,
    }
    try {
      if (amplitude) {
        amplitude.getInstance().logEvent(eventName, data)
      }
    } catch (error) {
      console.error(error)
    }
  })
}
