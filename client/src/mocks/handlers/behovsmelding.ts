import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
//import behovsmelding from '../data/behovsmelding_1.json'
import behovsmeldingEnkel from '../data/behovsmelding_demo1_nye_hotsak_enkel.json'
import behovsmeldingVanskelig from '../data/behovsmelding_demo1_nye_hotsak_vanskelig.json'
//import behovsmelding from '../data/behovsmelding_2.json'
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

    if (sakId == '323002') {
      return HttpResponse.json({ ...behovsmeldingVanskelig })
    } else {
      return HttpResponse.json({ ...behovsmeldingEnkel })
    }
  }),
]
