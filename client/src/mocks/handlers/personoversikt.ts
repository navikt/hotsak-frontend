import { delay, http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'

export const personoversiktHandlers: StoreHandlersFactory = ({ personStore }) => [
  http.post<never, { brukersFodselsnummer: string }>(`/api/person`, async ({ request }) => {
    const { brukersFodselsnummer } = await request.json()
    const person = await personStore.hent(brukersFodselsnummer)
    await delay(1000)
    if (!person) {
      return respondNotFound()
    }
    return HttpResponse.json(person)
  }),
]
