import { rest } from 'msw'

import type { StoreHandlersFactory } from '../data'
import innvilgetBrev from '../data/innvilgelsesBrev.pdf'

export const brevHandlers: StoreHandlersFactory = () => [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/sak/:sakID/brev`, async (req, res, ctx) => {
    const buffer = await fetch(innvilgetBrev).then((res) => res.arrayBuffer())

    return res(
      ctx.delay(1000),
      ctx.set('Content-Length', buffer.byteLength.toString()),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.body(buffer)
    )
  }),
]
