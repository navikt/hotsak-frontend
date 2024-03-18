import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'

export const hjelpemiddelHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  http.get<{ hmsnr: string }>(`/api/hjelpemiddel/:hmsnr`, async ({ params }) => {
    const { hmsnr } = params
    const hjelpemiddel = await hjelpemiddelStore.hent(hmsnr)

    if (!hjelpemiddel) {
      return respondNotFound()
    }
    return HttpResponse.json({ hmsnr, navn: hjelpemiddel.articleName })
  }),
]
