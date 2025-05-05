import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import behovsmelding from '../data/behovsmelding.json'
import type { SakParams } from './params'
import { delay, respondForbidden, respondInternalServerError, respondUnauthorized } from './response'

export const behovsmeldingHandlers: StoreHandlersFactory = () => [
  http.get<SakParams>(`/api/sak/:sakId/behovsmelding`, async ({ params }) => {
    const { sakId } = params
    if (sakId === '401') {
      return respondUnauthorized()
    }
    if (sakId === '403') {
      return respondForbidden()
    }
    if (sakId === '500') {
      return respondInternalServerError()
    }

    await delay(500)

    return HttpResponse.json({ ...behovsmelding })
  }),
]
