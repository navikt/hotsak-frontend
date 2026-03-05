import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const kodeverkHandlers: StoreHandlersFactory = () => [
  http.get<never, never, any[]>('/api/kodeverk/gjelder', async () => {
    // behandlingstype
    return HttpResponse.json([])
  }),
  http.get<never, never, any[]>('/api/kodeverk/oppgavetype', async () => {
    return HttpResponse.json([])
  }),
]
