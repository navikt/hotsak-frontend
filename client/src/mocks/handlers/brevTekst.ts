import { rest } from 'msw'

import { BrevTekst } from '../../types/types.internal'
import { StoreHandlersFactory } from '../data'

type NyBrevtekst = Pick<BrevTekst, 'brevmal' | 'brevtekst'>

export const brevtekstHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  rest.post<NyBrevtekst, { sakId: string }>(`/api/sak/:sakId/utkast`, async (req, res, ctx) => {
    const { brevmal, brevtekst } = await req.json<NyBrevtekst>()
    await barnebrillesakStore.lagreBrevtekst(req.params.sakId, brevmal, brevtekst)
    return res(ctx.delay(500), ctx.status(201))
  }),
  rest.get<undefined, { sakId: string }>(`/api/sak/:sakId/utkast`, async (req, res, ctx) => {
    const brevTekst = await barnebrillesakStore.hentBrevtekst(req.params.sakId)

    if (brevTekst) {
      return res(ctx.delay(500), ctx.status(200), ctx.json(brevTekst))
    } else {
      return res(ctx.delay(200), ctx.status(200), ctx.json({ sakId: req.params.sakId, brevmal: '', brevtekst: '' }))
    }
  }),
]
