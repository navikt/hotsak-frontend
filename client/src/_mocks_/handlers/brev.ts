import { rest } from 'msw'

import innvilgetBrev from '../mockdata/innvilgelsesBrev.pdf'

const brevHandlers = [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/sak/:sakID/brev`, async (req, res, ctx) => {
    const buffer = await fetch(innvilgetBrev).then((res) => res.arrayBuffer())

    return res(
      ctx.delay(3000),
      ctx.set('Content-Length', buffer.byteLength.toString()),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.body(buffer)
    )
  }),
]

export default brevHandlers
