import { rest } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const hjelpemiddelHandlers: StoreHandlersFactory = ({ hjelpemiddelStore }) => [
  rest.get<any, { hmsnr: string }, any>(`/api/hjelpemiddel/:hmsnr`, async (req, res, ctx) => {
    const { hmsnr } = req.params
    const hjelpemiddel = await hjelpemiddelStore.hent(hmsnr)

    if (!hjelpemiddel) {
      return res(ctx.status(404))
    }
    return res(ctx.status(200), ctx.json({ hmsnr, navn: hjelpemiddel.articleName }))
  }),
]
