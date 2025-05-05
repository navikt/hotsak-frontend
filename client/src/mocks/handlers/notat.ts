import { http, HttpResponse } from 'msw'

import type { FerdigstillNotatRequest, NotatUtkast } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { lastDokument } from '../data/felles'
import type { SakParams } from './params'
import { delay, respondNoContent, respondPdf } from './response'

interface NotatParams extends SakParams {
  notatId: string
}

export const notatHandlers: StoreHandlersFactory = ({ notatStore }) => [
  http.post<SakParams, NotatUtkast>(`/api/sak/:sakId/notater`, async ({ request, params }) => {
    const { type, tittel, tekst } = await request.json()
    await notatStore.lagreUtkast(params.sakId, { type, tittel, tekst })
    await delay(500)
    return respondNoContent()
  }),

  http.post<NotatParams, FerdigstillNotatRequest>(
    `/api/sak/:sakId/notater/:notatId/ferdigstilling`,
    async ({ request, params }) => {
      const payload = await request.json()

      await notatStore.ferdigstillNotat(params.notatId, payload)
      await delay(500)
      return respondNoContent()
    }
  ),

  http.post<NotatParams>(`/api/sak/:sakId/notater/:notatId/feilregistrering`, async ({ params }) => {
    await notatStore.slettNotat(params.notatId)
    await delay(500)
    return respondNoContent()
  }),

  http.put<NotatParams, NotatUtkast>(`/api/sak/:sakId/notater/:notatId`, async ({ request, params }) => {
    const { type, tittel, tekst } = await request.json()
    await notatStore.oppdaterUtkast(params.sakId, params.notatId, { type, tittel, tekst })
    await delay(500)
    return respondNoContent()
  }),

  http.get<SakParams>(`/api/sak/:sakId/notater`, async ({ params }) => {
    const notater = await notatStore.hentNotater(params.sakId)
    await delay(500)
    return HttpResponse.json({ notater: notater, totalElements: notater.length })
  }),

  http.delete<NotatParams>(`/api/sak/:sakId/notater/:notatId`, async ({ params }) => {
    await notatStore.slettNotat(params.notatId)
    await delay(100)
    return respondNoContent()
  }),

  http.get<NotatParams>(`/api/sak/:sakId/notater/:notatId`, async () => {
    const buffer = await lastDokument('journalført_notat')
    await delay(500)
    return respondPdf(buffer)
  }),
]
