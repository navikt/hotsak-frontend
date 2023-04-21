import { rest } from 'msw'

import type { TotrinnskontrollData } from '../../types/types.internal'
import { barnebrillesakStore } from '../mockdata/BarnebrillesakStore'

const totrinnsKontrollHandlers = [
  rest.post<any, { sakId: string }, any>(`/api/sak/:sakId/kontroll`, async (req, res, ctx) => {
    const sakId = req.params.sakId
    await barnebrillesakStore.sendTilGodkjenning(sakId)
    return res(ctx.delay(500), ctx.status(201), ctx.json({}))
  }),
  rest.put<TotrinnskontrollData, { sakId: string }, any>(`/api/sak/:sakId/kontroll`, async (req, res, ctx) => {
    const sakId = req.params.sakId
    const totrinnskontroll = await req.json<TotrinnskontrollData>()
    await barnebrillesakStore.ferdigstillTotrinnskontroll(sakId, totrinnskontroll)
    return res(ctx.delay(500), ctx.status(201), ctx.json({}))
  }),
]

export default totrinnsKontrollHandlers
