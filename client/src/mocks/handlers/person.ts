import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { delay, respondNotFound } from './response'

export const personHandlers: StoreHandlersFactory = ({ personStore }) => [
  http.post<never, { fnr: string }>(`/api/person`, async ({ request }) => {
    const { fnr } = await request.json()
    const person = await personStore.hent(fnr)
    await delay(500)

    if (!person) {
      return respondNotFound()
    }
    return HttpResponse.json(person)
  }),
]
