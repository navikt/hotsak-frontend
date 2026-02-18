import { http, HttpResponse } from 'msw'

import {
  erInternOppgaveId,
  type FinnOppgaverRequest,
  type FinnOppgaverResponse,
  type OppgaveId,
  oppgaveIdUtenPrefix,
} from '../../oppgave/oppgaveTypes.ts'
import { type Oppgavebehandlere } from '../../oppgave/useOppgavebehandlere.ts'
import { type StoreHandlersFactory } from '../data'
import { delay, respondNoContent, respondNotFound } from './response.ts'

export interface OppgaveParams {
  oppgaveId: OppgaveId
}

export const oppgaveHandlers: StoreHandlersFactory = ({ oppgaveStore, sakStore, saksbehandlerStore }) => [
  http.post<never, FinnOppgaverRequest, FinnOppgaverResponse>(`/api/oppgaver/sok`, async ({ request }) => {
    await delay(200)
    const response = await oppgaveStore.finn(await request.json())
    return HttpResponse.json(response)
  }),

  http.get<OppgaveParams>('/api/oppgaver/:oppgaveId', async ({ params }) => {
    const { oppgaveId } = params
    const oppgave = await oppgaveStore.hent(oppgaveId)
    await delay(75)
    if (!oppgave) {
      return respondNotFound()
    }
    return HttpResponse.json(oppgave)
  }),

  http.get<never, never, Oppgavebehandlere>('/api/oppgaver/:oppgaveId/behandlere', async () => {
    const behandlere = await saksbehandlerStore.alle()
    await delay(75)
    return HttpResponse.json({ behandlere })
  }),

  http.get<never, never, any[]>('/api/oppgaver/:oppgaveId/kommentarer', async () => {
    await delay(75)
    return HttpResponse.json([])
  }),

  http.post<OppgaveParams>(`/api/oppgaver/:oppgaveId/tildeling`, async ({ params }) => {
    const { oppgaveId } = params
    await oppgaveStore.tildel(oppgaveId)
    if (!erInternOppgaveId(oppgaveId)) {
      await sakStore.tildel(oppgaveIdUtenPrefix(oppgaveId))
    }
    await delay(200)
    return respondNoContent()
  }),

  http.delete<OppgaveParams>(`/api/oppgaver/:oppgaveId/tildeling`, async ({ params }) => {
    const { oppgaveId } = params
    await oppgaveStore.fjernTildeling(oppgaveId)
    if (!erInternOppgaveId(oppgaveId)) {
      await sakStore.fjernTildeling(oppgaveIdUtenPrefix(oppgaveId))
    }
    await delay(200)
    return respondNoContent()
  }),

  http.put<OppgaveParams, { behandlingstema?: string }>(`/api/oppgaver/:oppgaveId`, async ({ request, params }) => {
    const { behandlingstema } = await request.json()
    const { oppgaveId } = params
    if (!behandlingstema) {
      return respondNoContent()
    }
    await oppgaveStore.oppdaterKategorisering(oppgaveId, behandlingstema)
    await delay(200)
    return respondNoContent()
  }),

  http.get<OppgaveParams>(`/api/oppgaver/:oppgaveId/gjelder`, async ({ params }) => {
    const { oppgaveId } = params
    const result = await oppgaveStore.hentGjelderInfo(oppgaveId)
    const { behandlingstema, behandlingstype, alternativer } = result ?? {
      behandlingstema: undefined,
      behandlingstype: undefined,
      alternativer: undefined,
    }
    await delay(75)
    return HttpResponse.json({
      behandlingstema,
      behandlingstype,
      alternativer,
    })
  }),
]
