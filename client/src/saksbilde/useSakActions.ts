import { type Actions, useActionState } from '../action/Actions.ts'
import type { ISvar } from '../innsikt/Besvarelse.ts'
import { http } from '../io/HttpClient.ts'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { type TotrinnskontrollData } from '../types/types.internal.ts'
import { mutateSak } from './mutateSak.ts'

export interface SakActions extends Actions {
  overførSakTilGosys(tilbakemelding: ISvar[]): Promise<void>

  opprettTotrinnskontroll(): Promise<void>
  fullførTotrinnskontroll(data: TotrinnskontrollData): Promise<void>
}

export function useSakActions(): SakActions {
  const { oppgave, mutate: mutateOppgave } = useOppgave()
  const { oppgaveId, versjon, sakId } = oppgave ?? {}
  const { execute, state } = useActionState()

  const mutateOppgaveOgSak = () => Promise.all([mutateOppgave(), mutateSak(sakId)])

  return {
    async overførSakTilGosys(tilbakemelding) {
      return execute(async () => {
        await http.put(`/api/sak/${sakId}/tilbakeforing`, { oppgaveId, tilbakemelding }, { versjon })
        await mutateOppgaveOgSak()
      })
    },

    async opprettTotrinnskontroll(): Promise<void> {
      return execute(async () => {
        await http.post(`/api/sak/${sakId}/kontroll`, { oppgaveId }, { versjon }) // totrinnskontroll
        await mutateOppgaveOgSak()
      })
    },

    async fullførTotrinnskontroll(data: TotrinnskontrollData): Promise<void> {
      return execute(async () => {
        await http.put(`/api/sak/${sakId}/kontroll`, { oppgaveId, ...data }, { versjon }) // totrinnskontroll
        await mutateOppgaveOgSak()
      })
    },

    state,
  }
}
