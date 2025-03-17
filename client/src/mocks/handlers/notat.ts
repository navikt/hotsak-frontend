import { delay, http, HttpResponse } from 'msw'

import type { FerdigstillNotatRequest, NotatUtkast } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { lastDokument } from '../data/felles'
import type { SakParams } from './params'
import { respondNoContent, respondPdf } from './response'

interface NotatParams extends SakParams {
  notatId: string
}

export const notatHandlers: StoreHandlersFactory = ({ notatStore }) => [
  http.post<SakParams, NotatUtkast>(`/api/sak/:sakId/notater`, async ({ request, params }) => {
    const { type, tittel, tekst } = await request.json()
    //const saknotater = await notatStore.hentNotater(params.sakId)
    //const åpneUtkast = saknotater.filter((notat) => notat.type === type).filter((notat) => !notat.ferdigstilt)
    /*if (åpneUtkast.length > 0) {
      console.log(`Vi har allerede et åpent utkast av typen ${type} for sak. Hopper over denne.`)
      return respondNoContent()
    }*/
    await notatStore.lagreUtkast(params.sakId, { type, tittel, tekst })
    await delay(500)
    return respondNoContent()
  }),

  http.post<NotatParams, FerdigstillNotatRequest>(
    `/api/sak/:sakId/notater/:notatId/ferdigstilling`,
    async ({ request, params }) => {
      const payload = await request.json()

      await notatStore.ferdigstillNotat(Number(params.notatId), payload)
      await delay(500)
      return respondNoContent()
    }
  ),

  http.put<NotatParams, NotatUtkast>(`/api/sak/:sakId/notater/:notatId`, async ({ request, params }) => {
    const { type, tittel, tekst } = await request.json()
    await notatStore.oppdaterUtkast(params.sakId, Number(params.notatId), { type, tittel, tekst })
    await delay(500)
    return respondNoContent()
  }),

  http.get<SakParams>(`/api/sak/:sakId/notater`, async ({ params }) => {
    const notater = await notatStore.hentNotater(params.sakId)
    await delay(500)
    return HttpResponse.json(notater)
  }),

  http.delete<NotatParams>(`/api/sak/:sakId/notater/:notatId`, async ({ params }) => {
    await notatStore.slettNotat(Number(params.notatId))
    await delay(100)
    return respondNoContent()
  }),

  http.get<NotatParams>(`/api/sak/:sakId/notater/:notatId`, async () => {
    let buffer: ArrayBuffer

    buffer = await lastDokument('journalført_notat')
    await delay(500)
    return respondPdf(buffer)
  }),
]
