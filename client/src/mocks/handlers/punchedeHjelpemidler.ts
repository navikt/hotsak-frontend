import { http, HttpResponse } from 'msw'

import { type PunchetHjelpemiddel } from '../../journalføring/journalføringTypes.ts'
import { type StoreHandlersFactory } from '../data'
import { type SakParams } from './params'
import { delay } from './response'

export const punchedeHjelpemidlerHandlers: StoreHandlersFactory = ({ punchedeHjelpemidlerStore }) => [
  http.get<SakParams, never, PunchetHjelpemiddel[]>('/api/sak/:sakId/punchede-hjelpemidler', async ({ params }) => {
    const hjelpemidler = await punchedeHjelpemidlerStore.hent(params.sakId)
    await delay(200)
    return HttpResponse.json(hjelpemidler)
  }),
]
