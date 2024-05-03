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
        brukernummer: '1',
        leveringsadresse: {
          adresse: 'Gateadresse 1',
          postnummer: '4600',
          poststed: 'Kristiansand S',
          kommunenummer: 'Kristiansand',
        },
        primæradresse: '',
      },
      {
        brukernummer: '1',
        leveringsadresse: {
          adresse: 'Gateadresse 2',
          postnummer: '4601',
          poststed: 'Kristiansand S',
          kommunenummer: 'Kristiansand',
        },
        primæradresse: '',
      },
    ]
    return HttpResponse.json(adresser)
  }),
]
