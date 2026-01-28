import { delay, http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'
import { respondNotFound } from './response'
import { Sakstype } from '../../types/types.internal'

interface ProblemsammendragParams {
  sakId: string
}

export const problemsammendragHandlers: StoreHandlersFactory = ({
  sakStore,
  behovsmeldingStore,
  endreHjelpemiddelStore,
}) => [
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
    const hjelpemidler = behovsmelding?.behovsmelding.hjelpemidler.hjelpemidler ?? []

    const lavereRangerteHjelpemidler = hjelpemidler.filter((hjelpemiddel) => (hjelpemiddel.produkt.rangering ?? 0) > 1)

    const { endredeHjelpemidler } = await endreHjelpemiddelStore.hent(sakId)

    const harUendretLavereRangert = lavereRangerteHjelpemidler.some((hjelpemiddel) => {
      return !endredeHjelpemidler.some((endret) => endret.id === hjelpemiddel.hjelpemiddelId)
    })

    await delay(100)

    if (harUendretLavereRangert) {
      return HttpResponse.json(`POST MRS P9 R2 Manuell rullestol, Terskeleliminator; ${sakId}`)
    }
    return HttpResponse.json(`Manuell rullestol, Terskeleliminator; ${sakId}`)
  }),
]
