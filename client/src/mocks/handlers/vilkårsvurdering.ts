import { http, HttpResponse } from 'msw'

import { OppdaterVilkårRequest, OppgaveStatusType, VurderVilkårRequest } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { respondCreated } from './response'

export const vilkårsvurderingHandlers: StoreHandlersFactory = ({ barnebrillesakStore }) => [
  http.post<{ sakId: string }, VurderVilkårRequest>('/api/sak/:sakId/vilkarsgrunnlag', async ({ request, params }) => {
    const sakId = params.sakId
    const vurderVilkårRequest = await request.json()
    await barnebrillesakStore.vurderVilkår(sakId, vurderVilkårRequest)
    await barnebrillesakStore.oppdaterStatus(sakId, OppgaveStatusType.TILDELT_SAKSBEHANDLER)
    return respondCreated()
  }),

  http.put<{ sakId: string; vilkarId: string }, OppdaterVilkårRequest>(
    '/api/sak/:sakId/vilkar/:vilkarId',
    async ({ request, params }) => {
      const { sakId, vilkarId } = params
      const oppdaterVilkårRequest = await request.json()
      await barnebrillesakStore.oppdaterVilkår(sakId, vilkarId, oppdaterVilkårRequest)
      return HttpResponse.json({})
    }
  ),
]
