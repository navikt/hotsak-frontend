import { Actions, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'

export interface ModiaActions extends Actions {
  /**
   * Setter aktiv bruker med modiacontextholder. Må kalles før navigasjon til Modia
   * slik at riktig bruker åpnes i Modia personoversikt.
   */
  settAktivBruker(fodselsnummer: string): Promise<void>
}

export function useModiaActions(): ModiaActions {
  const { execute, state } = useActionState()

  return {
    async settAktivBruker(fodselsnummer) {
      return execute(() =>
        http.post('/modiacontextholder-api/api/context', {
          verdi: fodselsnummer,
          eventType: 'NY_AKTIV_BRUKER',
        })
      )
    },

    state,
  }
}
