import { Actions, useActionState } from '../action/Actions.ts'
import { useRequiredOppgaveContext } from '../oppgave/OppgaveContext.ts'

export interface SakActions extends Actions {
  overførSakTilGosys(): Promise<void>
  fattVedtak(): Promise<void>
  ferdigstillBestilling(): Promise<void>
}

export function useSakActions(): SakActions {
  const { state } = useActionState()
  const { oppgaveId, versjon } = useRequiredOppgaveContext()
  return {
    async overførSakTilGosys() {
      console.log(oppgaveId, versjon)
    },

    async fattVedtak() {
      console.log(oppgaveId, versjon)
    },

    async ferdigstillBestilling() {
      console.log(oppgaveId, versjon)
    },

    state,
  }
}
