import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { hjelpemiddeloversikt } from '../data/hjelpemiddeloversikt'
import { respondInternalServerError } from './response'

export const hjelpemiddeloversiktHandlers: StoreHandlersFactory = () => [
  http.post<never, { fnr: string }>(`/api/hjelpemiddeloversikt`, async ({ request }) => {
    const { fnr } = await request.json()
    if (fnr === '06115559891') {
      return HttpResponse.json([])
    } else if (fnr === '19044238651') {
      // Petter Andreas
      return HttpResponse.json(hjelpemiddeloversikt[0])
    } else if (fnr === '13044238651') {
      // Mia Cathrine
      return HttpResponse.json(hjelpemiddeloversikt[1])
    } else if (fnr === '500') {
      return respondInternalServerError()
    } else {
      return HttpResponse.json(hjelpemiddeloversikt[2])
    }
  }),
]
