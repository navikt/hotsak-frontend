import { Actions, useActionState } from '../action/Actions.ts'
import { http } from '../io/HttpClient.ts'
import type { BrevTekst, Brevtype } from '../types/types.internal.ts'
import { useOppgaveContext } from '../oppgave/OppgaveContext.ts'

export interface BrevActions extends Actions {
  lagreBrevutkast(tekst: BrevTekst): Promise<void>
  slettBrevutkast(sakId: string, brevtype: Brevtype): Promise<void>
  lagreBrevsending(tekst: BrevTekst): Promise<void>
}

export function useBrevActions(): BrevActions {
  const { oppgaveId, versjon } = useOppgaveContext()
  const { execute, state } = useActionState()
  return {
    lagreBrevutkast(tekst: BrevTekst): Promise<void> {
      return execute(() => http.post(`/api/sak/${tekst.sakId}/brevutkast`, { ...tekst, oppgaveId }, { versjon }))
    },
    slettBrevutkast(sakId: string, brevtype: Brevtype): Promise<void> {
      return execute(() => http.delete(`/api/sak/${sakId}/brevutkast/${brevtype}`, { versjon }))
    },
    lagreBrevsending(tekst: BrevTekst): Promise<void> {
      return execute(() => http.post(`/api/sak/${tekst.sakId}/brevsending`, { ...tekst, oppgaveId }, { versjon }))
    },
    state,
  }
}
