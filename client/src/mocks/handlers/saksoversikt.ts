import { http, HttpResponse } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const saksoversiktHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.post<never, { fnr: string; sakstype: string; behandlingsstatus: string }>(
    `/api/saksoversikt`,
    async ({ request }) => {
      const body = await request.json()
      const { fnr } = body
      // todo -> filtrer på sakstype, behandlingsstatus
      const saksoversikt = await sakStore.saksoversikt(fnr)
      return HttpResponse.json(saksoversikt)
    }
  ),
]
