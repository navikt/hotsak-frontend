import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import type { KodeverkGjelder } from '../../oppgave/oppgaveTypes.ts'

export const kodeverkHandlers: StoreHandlersFactory = ({ kodeverkStore }) => [
  http.get<never, never, ReadonlyArray<KodeverkGjelder>>('/api/kodeverk/gjelder', async () => {
    // behandlingstype
    return HttpResponse.json(kodeverkStore.gjelder())
  }),
  http.get<never, never, ReadonlyArray<string>>('/api/kodeverk/dokumenttitler', async () => {
    return HttpResponse.json(kodeverkStore.dokumenttitler())
  }),
]
