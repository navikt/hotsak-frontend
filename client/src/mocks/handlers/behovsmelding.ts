import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import type { SakParams } from './params'
import { delay, respondForbidden, respondInternalServerError, respondNotFound, respondUnauthorized } from './response'

export const behovsmeldingHandlers: StoreHandlersFactory = ({ sakStore, behovsmeldingStore }) => [
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

    const sak = await sakStore.hent(sakId)
    if (!sak) {
      return respondNotFound()
    }
    const behovsmeldingCase = await behovsmeldingStore.hentForSak(sak)
    if (!behovsmeldingCase) {
      return respondNotFound()
    }
    return HttpResponse.json(behovsmeldingCase.behovsmelding)
  }),
]
