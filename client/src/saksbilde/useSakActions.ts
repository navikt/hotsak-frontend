import { Actions, useActionState } from '../action/Actions.ts'
import type { ISvar } from '../innsikt/Besvarelse.ts'
import { baseUrl } from '../io/http.ts'
import { http } from '../io/HttpClient.ts'
import { useOppgave } from '../oppgave/useOppgave.ts'
import type { AvvisBestilling } from '../types/types.internal.ts'
import { mutateSak } from './mutateSak.ts'

export interface UseSakActions extends Actions {
  overførSakTilGosys(tilbakemelding: ISvar[]): Promise<void>
  fattVedtak(problemsammendrag: string): Promise<void>
  godkjennBestilling(beskjed?: string): Promise<void>
  avvisBestilling(tilbakemelding: AvvisBestilling): Promise<void>
}

export function useSakActions(): UseSakActions {
  const { oppgave, mutate: mutateOppgave } = useOppgave()
  const { oppgaveId, versjon, sakId } = oppgave ?? {}
  const { execute, state } = useActionState()

  const mutateOppgaveOgSak = () => Promise.all([mutateOppgave(), mutateSak(sakId)])

  return {
    async overførSakTilGosys(tilbakemelding) {
      return execute(async () => {
        await http.put(`${baseUrl}/api/sak/${sakId}/tilbakeforing`, { oppgaveId, tilbakemelding }, { versjon })
        await mutateOppgaveOgSak()
      })
    },

    async fattVedtak(problemsammendrag) {
      return execute(async () => {
        await http.put(`${baseUrl}/api/sak/${sakId}/vedtak`, { oppgaveId, problemsammendrag }, { versjon })
        await mutateOppgaveOgSak()
      })
    },

    async godkjennBestilling(beskjed) {
      return execute(async () => {
        await http.put(`${baseUrl}/api/bestilling/${sakId}/ferdigstilling`, { oppgaveId, beskjed }, { versjon })
        await mutateOppgaveOgSak()
      })
    },

    async avvisBestilling(tilbakemelding) {
      return execute(async () => {
        await http.put(`${baseUrl}/api/bestilling/${sakId}/avvisning`, { oppgaveId, tilbakemelding }, { versjon })
        await mutateOppgaveOgSak()
      })
    },

    state,
  }
}
