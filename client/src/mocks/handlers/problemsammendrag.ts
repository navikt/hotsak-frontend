import { delay, http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'
import { Sakstype } from '../../types/types.internal'

interface ProblemsammendragParams {
  sakId: string
}

export const problemsammendragHandlers: StoreHandlersFactory = ({ sakStore, behovsmeldingStore }) => [
  http.get<ProblemsammendragParams>(`/api/sak/:sakId/serviceforesporsel`, async ({ params }) => {
    const { sakId } = params
    const sak = await sakStore.hent(sakId)
    if (!sak) {
      return respondNotFound()
    }
    if (sak.sakstype === Sakstype.BARNEBRILLER) {
      return HttpResponse.json({})
    }
    const behovsmelding = await behovsmeldingStore.hentForSak(sak)
    let lavere = false
    behovsmelding?.behovsmelding.hjelpemidler.hjelpemidler.map((hjelpemiddel) => {
      if (hjelpemiddel.produkt.rangering! > 1) {
        lavere = true
      }
    })
    await delay(100)
    if (lavere) {
      return HttpResponse.json(`POST MRS P9 R2 Manuell rullestol, Terskeleliminator; ${sakId}`)
    }
    return HttpResponse.json(`Manuell rullestol, Terskeleliminator; ${sakId}`)
  }),
]
