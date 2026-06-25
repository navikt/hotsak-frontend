import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import type { KodeverkGjelder } from '../../oppgave/oppgaveTypes.ts'

export const kodeverkHandlers: StoreHandlersFactory = ({ kodeverkStore }) => [
  http.get('/api/kodeverk/behandlingstyper', async () => {
    return HttpResponse.json(kodeverkStore.behandlingstyper())
  }),

  http.get<never, never, ReadonlyArray<KodeverkGjelder>>('/api/kodeverk/gjelder', async ({ request }) => {
    const behandlingstype = new URL(request.url).searchParams.get('behandlingstype') ?? undefined
    return HttpResponse.json(kodeverkStore.gjelder(behandlingstype))
  }),

  http.get<never, never, ReadonlyArray<string>>('/api/kodeverk/dokumenttitler', async () => {
    return HttpResponse.json(kodeverkStore.dokumenttitler())
  }),
]
