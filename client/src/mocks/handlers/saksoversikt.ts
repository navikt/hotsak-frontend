import { rest } from 'msw'

import { OppgaveStatusType, Oppgavetype } from '../../types/types.internal'
import { StoreHandlersFactory } from '../data'

export const saksoversiktHandlers: StoreHandlersFactory = ({ saksoversiktStore }) => [
  rest.post<{ brukersFodselsnummer: any }>(`/api/saksoversikt`, async (req, res, ctx) => {
    const body = await req.json()
    const { brukersFodselsnummer, saksType, behandlingsStatus } = body

    const saksoversikt = await saksoversiktStore.alle()

    if (brukersFodselsnummer === '19044238651') {
      // Petter Andreas
      return res(ctx.status(200), ctx.json(saksoversikt[0]))
    } else if (brukersFodselsnummer === '13044238651') {
      // Mia Cathrine
      return res(ctx.status(200), ctx.json(saksoversikt[1]))
    } else if (brukersFodselsnummer === '1234') {
      return res(ctx.status(500))
    } else if (brukersFodselsnummer === '6666') {
      return res(ctx.status(200), ctx.json({ hotsakSaker: [] }))
    } else if (saksType && behandlingsStatus) {
      const filtrerteSaker = saksoversikt[2].hotsakSaker.filter(
        (sak) =>
          sak.sakstype === Oppgavetype.TILSKUDD &&
          (sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER ||
            sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER)
      )
      return res(ctx.status(200), ctx.json({ hotsakSaker: filtrerteSaker }))
    } else {
      return res(ctx.status(200), ctx.json(saksoversikt[2]))
    }
  }),
]
