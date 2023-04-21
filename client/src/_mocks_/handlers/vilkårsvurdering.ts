import { rest } from 'msw'

import { OppdaterVilkårRequest, VurderVilkårRequest } from '../../types/types.internal'
import { barnebrillesakStore } from '../mockdata/BarnebrillesakStore'

const vilkårsvurderingHandlers = [
  rest.post<VurderVilkårRequest, { sakId: string }, any>('/api/sak/:sakId/vilkarsgrunnlag', async (req, res, ctx) => {
    const sakId = req.params.sakId
    const vurderVilkårRequest = await req.json<VurderVilkårRequest>()
    await barnebrillesakStore.vurderVilkår(sakId, vurderVilkårRequest)
    return res(ctx.status(201))
  }),
  rest.put<OppdaterVilkårRequest, { sakId: string; vilkarId: string }, any>(
    '/api/sak/:sakId/vilkar/:vilkarId',
    async (req, res, ctx) => {
      const { sakId, vilkarId } = req.params
      const oppdaterVilkårRequest = await req.json<OppdaterVilkårRequest>()
      await barnebrillesakStore.oppdaterVilkår(sakId, vilkarId, oppdaterVilkårRequest)
      return res(ctx.status(200), ctx.json({}))
    }
  ),
]

export default vilkårsvurderingHandlers
