import { http, HttpResponse } from 'msw'

import { type Oppgavekommentar } from '../../oppgave/kommentar/useOppgavekommentarer.ts'
import {
  erInternOppgaveId,
  type FinnOppgaverRequest,
  type FinnOppgaverResponse,
  type OppgaveId,
  oppgaveIdUtenPrefix,
} from '../../oppgave/oppgaveTypes.ts'
import { type EndreOppgaveRequest } from '../../oppgave/useOppgaveActions.ts'
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

  http.get<OppgaveParams, never, Oppgavekommentar[]>('/api/oppgaver/:oppgaveId/kommentarer', async ({ params }) => {
    await delay(75)
    const { oppgaveId } = params
    const kommentarer = await oppgaveStore.finnKommentarer(oppgaveId)
    return HttpResponse.json(kommentarer)
  }),

  http.post<OppgaveParams, { tekst: string }>('/api/oppgaver/:oppgaveId/kommentarer', async ({ request, params }) => {
    await delay(75)
    const { oppgaveId } = params
    const { tekst } = await request.json()
    const saksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    await oppgaveStore.lagreKommentar(oppgaveId, {
      oppgaveId,
      tekst,
      registrertAv: saksbehandler,
      registrertAvEnhet: saksbehandler.gjeldendeEnhet,
      registrertAvSystem: 'HOTSAK',
      registrertTidspunkt: new Date().toISOString(),
    })
    return respondNoContent()
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

  http.put<OppgaveParams, EndreOppgaveRequest>(`/api/oppgaver/:oppgaveId`, async ({ request, params }) => {
    const { oppgaveId } = params
    await oppgaveStore.endre(oppgaveId, await request.json())
    await delay(200)
    return respondNoContent()
  }),

  http.put<OppgaveParams>(`/api/oppgaver/:oppgaveId/leste`, async ({ params }) => {
    const { oppgaveId } = params
    await oppgaveStore.merkSomLest(oppgaveId)
    await delay(200)
    return respondNoContent()
  }),

  http.get<OppgaveParams>(`/api/oppgaver/:oppgaveId/gjelder`, async () => {
    return HttpResponse.json({})
  }),
]
