import { http, HttpResponse } from 'msw'

import { Gjenstående, UtfallLåst, VedtaksResultat } from '../../sak/v2/behandling/behandlingTyper'
import type { BrevTekst, Brevtype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import type { SakParams } from './params'
import { delay, respondNoContent } from './response'

type NyBrevtekst = Pick<BrevTekst, 'brevtype' | 'data'>

interface BrevutkastParams extends SakParams {
  brevtype: Brevtype
}

export const brevutkastHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.post<SakParams, NyBrevtekst>(`/api/sak/:sakId/brevutkast`, async ({ request, params }) => {
    const { brevtype, data } = await request.json()
    await sakStore.lagreBrevtekst(params.sakId, brevtype, data)

    const behandlinger = await sakStore.hentBehandlinger(params.sakId)

    if (behandlinger.length > 0) {
      const gjeldendeBehandling = behandlinger[0]
      if (
        !gjeldendeBehandling.gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT) &&
        !gjeldendeBehandling.utfallLåst?.includes(UtfallLåst.HAR_VEDTAKSBREV)
      ) {
        console.log('Første gang, setter gjenstående og utfallLåst')

        await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
          ...gjeldendeBehandling,
          gjenstående: [Gjenstående.BREV_IKKE_FERDIGSTILT],
          utfallLåst: [UtfallLåst.HAR_VEDTAKSBREV],
        })
      }
    }
    await delay(1000)
    return respondNoContent()
  }),

  // TODO refaktorer og slå sammen litt her
  http.post<SakParams>(`/api/sak/:sakId/brevutkast/BREVEDITOR_VEDTAKSBREV/ferdigstilling`, async ({ params }) => {
    console.log('Markerer brevutkast som ferdigstilt for sakId', params.sakId)
    await sakStore.lagreBrevstatus(params.sakId, { ferdigstilt: true })

    const behandlinger = await sakStore.hentBehandlinger(params.sakId)

    if (behandlinger.length > 0) {
      const gjeldendeBehandling = behandlinger[0]

      await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
        ...gjeldendeBehandling,
        gjenstående: [],
      })
    }

    return respondNoContent()
  }),
  http.delete<SakParams>(`/api/sak/:sakId/brevutkast/BREVEDITOR_VEDTAKSBREV/ferdigstilling`, async ({ params }) => {
    console.log('Fjerner ferdigstilling på brevutkast for sakId', params.sakId)
    await sakStore.lagreBrevstatus(params.sakId, { ferdigstilt: false })
    const behandlinger = await sakStore.hentBehandlinger(params.sakId)

    if (behandlinger.length > 0) {
      const gjeldendeBehandling = behandlinger[0]

      await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
        ...gjeldendeBehandling,
        gjenstående: [Gjenstående.BREV_IKKE_FERDIGSTILT],
      })
    }
    return respondNoContent()
  }),

  http.delete<BrevutkastParams>(`/api/sak/:sakId/brevutkast/:brevtype`, async ({ params }) => {
    await sakStore.fjernBrevtekst(params.sakId)

    const behandlinger = await sakStore.hentBehandlinger(params.sakId)

    if (behandlinger && behandlinger.length > 0) {
      const gjeldendeBehandling = behandlinger[0]

      if (gjeldendeBehandling.utfall?.utfall === VedtaksResultat.INNVILGET) {
        console.log('Fjerner brevutkast på utfall innvilget')

        await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
          ...gjeldendeBehandling,
          gjenstående: [],
          utfallLåst: [],
        })
      } else {
        await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
          ...gjeldendeBehandling,
          gjenstående: [Gjenstående.BREV_MANGLER],
          utfallLåst: [],
        })
      }
    }

    await delay(500)
    return respondNoContent()
  }),

  http.get<BrevutkastParams>(`/api/sak/:sakId/brevutkast/:brevtype`, async ({ params }) => {
    const brevTekst = await sakStore.hentBrevtekst(params.sakId)
    await delay(800)
    if (brevTekst) {
      return HttpResponse.json({ ...brevTekst, opprettet: new Date().toISOString() })
    } else {
      return HttpResponse.json({
        sakId: params.sakId,
        brevtype: '',
        data: { brevtekst: '' },
        opprettet: new Date().toISOString(),
      })
    }
  }),
]
