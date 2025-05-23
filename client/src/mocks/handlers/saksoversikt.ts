import { http, HttpResponse } from 'msw'

import { BehandlingstatusType, OppgaveStatusType, Sakstype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'

export const saksoversiktHandlers: StoreHandlersFactory = ({ saksoversiktStore, sakStore }) => [
  http.post<never, { fnr: string; sakstype: string; behandlingsstatus: string }>(
    `/api/saksoversikt`,
    async ({ request }) => {
      const body = await request.json()
      const { fnr, sakstype, behandlingsstatus } = body

      const saksoversikt = await saksoversiktStore.alle()

      console.log(sakstype, behandlingsstatus)

      if (fnr === '19044238651') {
        // Petter Andreas
        return HttpResponse.json(saksoversikt[0])
      } else if (fnr === '13044238651') {
        // Mia Cathrine
        return HttpResponse.json(saksoversikt[1])
      } else if (fnr === '1234') {
        return HttpResponse.error()
      } else if (fnr === '6666') {
        return HttpResponse.json({ hotsakSaker: [] })
      } else if (sakstype === Sakstype.BARNEBRILLER && behandlingsstatus === BehandlingstatusType.ÅPEN) {
        const åpneSaker = (await sakStore.alle()).filter((sak) => {
          return (
            sak.sakstype === Sakstype.BARNEBRILLER &&
            (sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER ||
              sak.status === OppgaveStatusType.AVVENTER_DOKUMENTASJON)
          )
        })

        return HttpResponse.json({ hotsakSaker: åpneSaker })
      } else {
        return HttpResponse.json(saksoversikt[2])
      }
    }
  ),
]
