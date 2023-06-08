import { rest } from 'msw'

import { Notat } from '../../types/types.internal'
import { StoreHandlersFactory } from '../data'

type NyttNotat = Pick<Notat, 'type' | 'innhold'>

export const notatHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  rest.post<NyttNotat, { sakId: string }>(`/api/sak/:sakId/notater`, async (req, res, ctx) => {
    const { type, innhold } = await req.json<NyttNotat>()
    await barnebrillesakStore.lagreNotat(req.params.sakId, type, innhold)
    return res(ctx.delay(500), ctx.status(201))
  }),
  rest.get<undefined, { sakId: string }>(`/api/sak/:sakId/notater`, async (req, res, ctx) => {
    const notater = await barnebrillesakStore.hentNotater(req.params.sakId)
    return res(ctx.delay(100), ctx.status(200), ctx.json(notater))
  }),
  rest.delete<undefined, { sakId: string; notatId: string }>(
    `/api/sak/:sakId/notater/:notatId`,
    async (req, res, ctx) => {
      await barnebrillesakStore.slettNotat(Number(req.params.notatId))
      return res(ctx.delay(100), ctx.status(204))
    }
  ),
]
