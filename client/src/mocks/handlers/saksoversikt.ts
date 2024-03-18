import { http, HttpResponse } from 'msw'

import { OppgaveStatusType, Sakstype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'

export const saksoversiktHandlers: StoreHandlersFactory = ({ saksoversiktStore }) => [
  http.post<never, { brukersFodselsnummer: string; saksType: string; behandlingsStatus: string }>(
    `/api/saksoversikt`,
    async ({ request }) => {
      const body = await request.json()
      const { brukersFodselsnummer, saksType, behandlingsStatus } = body

      const saksoversikt = await saksoversiktStore.alle()

      if (brukersFodselsnummer === '19044238651') {
        // Petter Andreas
        return HttpResponse.json(saksoversikt[0])
      } else if (brukersFodselsnummer === '13044238651') {
        // Mia Cathrine
        return HttpResponse.json(saksoversikt[1])
      } else if (brukersFodselsnummer === '1234') {
        return HttpResponse.error()
      } else if (brukersFodselsnummer === '6666') {
        return HttpResponse.json({ hotsakSaker: [] })
      } else if (saksType && behandlingsStatus) {
        const filtrerteSaker = saksoversikt[2].hotsakSaker.filter(
          (sak) =>
            sak.sakstype === Sakstype.TILSKUDD &&
            (sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER ||
              sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER)
        )
        return HttpResponse.json({ hotsakSaker: filtrerteSaker })
      } else {
        return HttpResponse.json(saksoversikt[2])
      }
    }
  ),
]
