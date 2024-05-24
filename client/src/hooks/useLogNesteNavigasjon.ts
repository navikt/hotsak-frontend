// import { useLocation } from 'react-router-dom'

import { logDebug } from '../utvikling/logDebug.ts'

export function useLogNesteNavigasjon() {
  // const location = useLocation()
  /**
   * Brukes for å logge den neste navigasjonen til Amplitude som gjøres etter
   * at en spesifikk hendelse har skjedd. For eksempel hvor brukeren navigerer etter
   * at en søknad har blitt innvilget. Gjøres kun én gang, deretter blir
   * listeneren fjernet.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const logNesteNavigasjon = (fraHendelse: string, data?: any) => {
    logDebug(fraHendelse, data)
    /*
    const unlisten = history.listen((location: any) => {
      logAmplitudeEvent(amplitude_taxonomy.NAVIGASJON_ETTER_HENDELSE, {
        fraHendelse,
        til: location.pathname,
        ...data,
      })

      unlisten()
    })
    */
  }

  return [logNesteNavigasjon]
}
