import { useHistory } from 'react-router-dom'
import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

const useLogNesteNavigasjon = () => {
  const history = useHistory()
  /**
   * Brukes for å logge til Amplitude den neste navigasjonen som gjøres etter
   * at en spesifikk hendelse har skjedd. For eksempel hvor brukeren navigerer etter
   * at en søknad har blitt innvilget. Gjøres kun én gang, deretter blir
   * listeneren fjernet.
   */
  const logNesteNavigasjon = (fraHendelse: string, data?: any) => {
    const unlisten = history.listen((location) => {
      logAmplitudeEvent(amplitude_taxonomy.NAVIGASJON_ETTER_HENDELSE, {
        fraHendelse,
        til: location.pathname,
        ...data,
      })

      unlisten()
    })
  }

  return [logNesteNavigasjon]
}

export default useLogNesteNavigasjon
