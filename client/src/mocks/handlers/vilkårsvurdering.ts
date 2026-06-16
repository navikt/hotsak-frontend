import { http } from 'msw'

import {
  type OppdaterVilkårRequest,
  OppgaveStatusType,
  StegType,
  type VurderVilkårRequest,
} from '../../types/types.internal'
import { type StoreHandlersFactory } from '../data'
import { type SakParams } from './params'
import { respondCreated, respondNoContent } from './response'

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

  http.post<SakParams>('/api/sak/:sakId/vilkarsvurdering', async ({ params }) => {
    await sakStore.oppdaterSteg(params.sakId, StegType.FATTE_VEDTAK)
    return respondNoContent()
  }),
]
