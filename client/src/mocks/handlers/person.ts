import { delay, http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'
import type { OebsAdresse } from '../../personoversikt/useOebsAdresser'

export const personHandlers: StoreHandlersFactory = ({ personStore }) => [
  http.post<never, { brukersFodselsnummer: string }>(`/api/person`, async ({ request }) => {
    const { brukersFodselsnummer } = await request.json()
    const person = await personStore.hent(brukersFodselsnummer)
    await delay(1000)
    if (!person) {
      return respondNotFound()
    }
    return HttpResponse.json(person)
  }),

  http.post<never, { brukersFodselsnummer: string }, OebsAdresse[]>(`/api/person/oebs-adresser`, async () => {
    await delay(100)
    const adresser: OebsAdresse[] = [
      {
        brukerNr: '1',
        leveringAddresse: 'Gateadresse 1',
        leveringKommune: 'Kristiansand',
        leveringPostnr: '4600',
        leveringBy: 'Kristiansand S',
        primærAdr: true,
      },
      {
        brukerNr: '1',
        leveringAddresse: 'Gateadresse 2',
        leveringKommune: 'Kristiansand',
        leveringPostnr: '4601',
        leveringBy: 'Kristiansand S',
        primærAdr: false,
      },
    ]
    return HttpResponse.json(adresser)
  }),
]
