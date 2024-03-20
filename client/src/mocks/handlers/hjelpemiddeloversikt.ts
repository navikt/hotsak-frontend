import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { hjelpemiddeloversikt } from '../data/hjelpemiddeloversikt'
import { respondInternalServerError } from './response'

export const hjelpemiddeloversiktHandlers: StoreHandlersFactory = () => [
  http.post<never, { brukersFodselsnummer: string }>(`/api/hjelpemiddeloversikt`, async ({ request }) => {
    const { brukersFodselsnummer } = await request.json()
    if (brukersFodselsnummer === '06115559891') {
      return HttpResponse.json([])
    } else if (brukersFodselsnummer === '19044238651') {
      // Petter Andreas
      return HttpResponse.json(hjelpemiddeloversikt[0])
    } else if (brukersFodselsnummer === '13044238651') {
      // Mia Cathrine
      return HttpResponse.json(hjelpemiddeloversikt[1])
    } else if (brukersFodselsnummer === '500') {
      return respondInternalServerError()
    } else {
      return HttpResponse.json(hjelpemiddeloversikt[2])
    }
  }),
]
