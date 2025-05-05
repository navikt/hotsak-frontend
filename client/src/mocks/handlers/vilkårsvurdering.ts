import { http } from 'msw'

import { OppdaterVilkårRequest, OppgaveStatusType, VurderVilkårRequest } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { respondCreated, respondNoContent } from './response'
import type { SakParams } from './params'

interface VilkårParams extends SakParams {
  vilkarId: string
}

export const vilkårsvurderingHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.post<SakParams, VurderVilkårRequest>('/api/sak/:sakId/vilkarsgrunnlag', async ({ request, params }) => {
    const sakId = params.sakId
    const payload = await request.json()
    await sakStore.vurderVilkår(sakId, payload)
    await sakStore.oppdaterStatus(sakId, OppgaveStatusType.TILDELT_SAKSBEHANDLER)
    return respondCreated()
  }),

  http.put<VilkårParams, OppdaterVilkårRequest>('/api/sak/:sakId/vilkar/:vilkarId', async ({ request, params }) => {
    const { vilkarId } = params
    const payload = await request.json()
    await sakStore.oppdaterVilkår(vilkarId, payload)
    return respondNoContent()
  }),
]
