import { rest } from 'msw'

import { BrevTekst, Brevtype } from '../../types/types.internal'
import { StoreHandlersFactory } from '../data'

type NyBrevtekst = Pick<BrevTekst, 'brevtype' | 'data'>

export const brevtekstHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  rest.post<NyBrevtekst, { sakId: string }>(`/api/sak/:sakId/brevutkast`, async (req, res, ctx) => {
    const { brevtype, data } = await req.json<NyBrevtekst>()
    await barnebrillesakStore.lagreBrevtekst(req.params.sakId, brevtype, data.brevtekst)
    return res(ctx.delay(500), ctx.status(201))
  }),
  rest.delete<any, { sakId: string; brevtype: Brevtype }>(
    `/api/sak/:sakId/brevutkast/:brevtype`,
    async (req, res, ctx) => {
      barnebrillesakStore.fjernBrevtekst(req.params.sakId)
      return res(ctx.delay(400), ctx.status(200))
    }
  ),
  rest.get<undefined, { sakId: string }>(`/api/sak/:sakId/brevutkast/:brevtype`, async (req, res, ctx) => {
    const brevTekst = await barnebrillesakStore.hentBrevtekst(req.params.sakId)

    if (brevTekst) {
      return res(ctx.delay(500), ctx.status(200), ctx.json(brevTekst))
    } else {
      return res(
        ctx.delay(200),
        ctx.status(200),
        ctx.json({ sakId: req.params.sakId, brevtype: '', data: { brevtekst: '' } })
      )
    }
  }),
]
