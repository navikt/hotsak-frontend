import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'
//import { respondNotFound } from './response'

interface HjelpemiddelParams {
  hmsnr: string
}

export const hjelpemiddelHandlers: StoreHandlersFactory = (/*{ hjelpemiddelStore }*/) => [
  http.get<HjelpemiddelParams>(`/api/hjelpemiddel/:hmsnr`, async ({ params }) => {
    const { hmsnr } = params
    //const hjelpemiddel = await hjelpemiddelStore.hent(hmsnr)
    /*if (!hjelpemiddel) {
      return respondNotFound()
    }*/
    if (hmsnr === '404404') {
      return respondNotFound()
    }

    return HttpResponse.json({ hmsnr, navn: 'Artikkelnavn fra OeBS for ' + hmsnr })
  }),
]
