import { rest } from 'msw'

import type { BeregnSatsRequest, BeregnSatsResponse } from '../../types/types.internal'
import { beregnSats } from '../data/beregnSats'

export const brillekalkulatorHandlers = () => [
  rest.post<BeregnSatsRequest, any, BeregnSatsResponse>('/brillekalkulator-api/api/brillesedler', (req, res, ctx) => {
    return res(
      ctx.delay(100),
      ctx.json(
        beregnSats({
          høyreSfære: req.body.høyreSfære,
          høyreSylinder: req.body.høyreSylinder,
          venstreSfære: req.body.venstreSfære,
          venstreSylinder: req.body.venstreSylinder,
        })
      )
    )
  }),
]
