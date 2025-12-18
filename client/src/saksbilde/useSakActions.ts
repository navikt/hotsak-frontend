import { Actions, useActionState } from '../action/Actions.ts'
import type { ISvar } from '../innsikt/Besvarelse.ts'
import { http } from '../io/HttpClient.ts'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { AvvisBestilling, OppgaveStatusType, TotrinnskontrollData } from '../types/types.internal.ts'
import { mutateSak } from './mutateSak.ts'

export interface SakActions extends Actions {
  overførSakTilGosys(tilbakemelding: ISvar[]): Promise<void>
  fattVedtak(problemsammendrag: string): Promise<void>
  godkjennBestilling(beskjed?: string): Promise<void>
  avvisBestilling(tilbakemelding: AvvisBestilling): Promise<void>
  opprettTotrinnskontroll(): Promise<void>
  fullførTotrinnskontroll(data: TotrinnskontrollData): Promise<void>

  /**
   * På sikt blir nok dette noe man gjør på oppgavenivå.
   */
  fortsettBehandling(): Promise<void>
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

    async fattVedtak(problemsammendrag) {
      return execute(async () => {
        await http.put(`/api/sak/${sakId}/vedtak`, { oppgaveId, problemsammendrag }, { versjon })
        await mutateOppgaveOgSak()
      })
    },
    async godkjennBestilling(beskjed) {
      return execute(async () => {
        await http.put(`/api/bestilling/${sakId}/ferdigstilling`, { oppgaveId, beskjed }, { versjon })
        await mutateOppgaveOgSak()
      })
    },

    async avvisBestilling(tilbakemelding) {
      return execute(async () => {
        await http.put(`/api/bestilling/${sakId}/avvisning`, { oppgaveId, tilbakemelding }, { versjon })
        await mutateOppgaveOgSak()
      })
    },

    async opprettTotrinnskontroll(): Promise<void> {
      return execute(async () => {
        await http.post(`/api/sak/${sakId}/kontroll`, {})
        await mutateOppgaveOgSak()
      })
    },

    async fullførTotrinnskontroll(data: TotrinnskontrollData): Promise<void> {
      return execute(async () => {
        await http.put(`/api/sak/${sakId}/kontroll`, data)
        await mutateOppgaveOgSak()
      })
    },

    async fortsettBehandling(): Promise<void> {
      return execute(async () => {
        await http.put(`/api/sak/${sakId}/status`, { status: OppgaveStatusType.TILDELT_SAKSBEHANDLER })
        await mutateOppgaveOgSak()
      })
    },

    state,
  }
}
