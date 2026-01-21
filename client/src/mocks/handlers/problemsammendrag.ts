import { delay, http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'

interface ProblemsammendragParams {
  sakId: string
}

export const problemsammendragHandlers: StoreHandlersFactory = () => [
  http.get<ProblemsammendragParams>(`/api/sak/:sakId/serviceforesporsel`, async ({ params }) => {
    const { sakId } = params
    await delay(500)

    return HttpResponse.json(`POST MRS P9 R2 Manuell rullestol, Terskeleliminator; ${sakId}`)
  }),
]
