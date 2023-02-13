import { rest } from 'msw'

import innvilgetBrev from '../mockdata/forhåndsvisningInnvilgetBrev.txt'

const brevHandlers = [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/sak/:sakID/brev`, async (req, res, ctx) => {
    const buffer = await fetch(innvilgetBrev).then((res) => res.arrayBuffer())

    console.log('Buffer', buffer)

    return res(
      ctx.set('Content-Length', buffer.byteLength.toString()),
      ctx.set('Content-Type', 'text/html'),
      ctx.body(buffer)
    )
  }),
]

export default brevHandlers
