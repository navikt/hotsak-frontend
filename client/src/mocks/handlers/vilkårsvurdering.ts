import { http } from 'msw'

import { OppdaterVilkårRequest, OppgaveStatusType, VurderVilkårRequest } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { respondCreated, respondNoContent } from './response'
import type { SakParams } from './params'

interface VilkårParams extends SakParams {
  vilkarId: string
}

export const vilkårsvurderingHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  http.post<SakParams, VurderVilkårRequest>('/api/sak/:sakId/vilkarsgrunnlag', async ({ request, params }) => {
    const sakId = params.sakId
    const vurderVilkårRequest = await request.json()
    await barnebrillesakStore.vurderVilkår(sakId, vurderVilkårRequest)
    await barnebrillesakStore.oppdaterStatus(sakId, OppgaveStatusType.TILDELT_SAKSBEHANDLER)
    return respondCreated()
  }),

  http.put<VilkårParams, OppdaterVilkårRequest>('/api/sak/:sakId/vilkar/:vilkarId', async ({ request, params }) => {
    const { vilkarId } = params
    const oppdaterVilkårRequest = await request.json()
    await barnebrillesakStore.oppdaterVilkår(vilkarId, oppdaterVilkårRequest)
    return respondNoContent()
  }),
]
