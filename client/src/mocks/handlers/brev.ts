import { http, HttpResponse } from 'msw'

import {
  type Brev,
  Brevmal,
  type FerdigstillBrevutkastRequest,
  type OppdaterBrevutkastRequest,
  type OpprettBrevutkastRequest,
} from '../../brev/brevTyper'
import { UtfallLåst } from '../../sak/v2/behandling/behandlingTyper'
import type { StoreHandlersFactory } from '../data'
import { lastDokument } from '../data/felles'
import type { SakParams } from './params'
import { respondNoContent, respondPdf } from './response'

interface BrevParams extends SakParams {
  brevId: string
}

export const brevHandlers: StoreHandlersFactory = ({ sakStore }) => [
  /**
   * Opprett brevutkast.
   */
  http.post<SakParams, OpprettBrevutkastRequest>('/api/sak/:sakId/brev', async ({ params, request }) => {
    const { sakId } = params
    const brev = await sakStore.opprettBrevutkast(sakId, await request.json())
    return HttpResponse.json(brev)
  }),

  /**
   * Oppdater brevutkast.
   */
  http.put<BrevParams, OppdaterBrevutkastRequest>('/api/sak/:sakId/brev/:brevId', async ({ params, request }) => {
    const { brevId } = params
    const brev = await sakStore.oppdaterBrevutkast(brevId, await request.json())
    return HttpResponse.json(brev)
  }),

  /**
   * Slett brevutkast.
   */
  http.delete<BrevParams>('/api/sak/:sakId/brev/:brevId', async ({ params }) => {
    const { brevId } = params
    await sakStore.slettBrevutkast(brevId)
    return respondNoContent()
  }),

  /**
   * Ferdigstill brevutkast.
   */
  http.post<BrevParams, FerdigstillBrevutkastRequest>(
    '/api/sak/:sakId/brev/:brevId/ferdigstilling',
    async ({ params }) => {
      const { brevId } = params
      await sakStore.ferdigstillBrevutkast(brevId)
      return respondNoContent()
    }
  ),

  /**
   * Rediger brevutkast.
   */
  http.delete<BrevParams>('/api/sak/:sakId/brev/:brevId/ferdigstilling', async ({ params }) => {
    const { brevId } = params
    await sakStore.redigerBrevutkast(brevId)
    return respondNoContent()
  }),

  // fixme
  http.get<SakParams>('/api/sak/:sakId/brev/utsendingsinfo', async ({ params }) => {
    const { sakId } = params

    const brev = null // await sakStore.hentBrevtekst(sakId)

    const behandlinger = await sakStore.hentBehandlinger(sakId)
    const gjeldendeBehandling = behandlinger.length > 0 ? behandlinger[0] : null

    const behandlingFerdigstilt = gjeldendeBehandling?.utfallLåst?.includes(UtfallLåst.FERDIGSTILT)

    if (!brev || !behandlingFerdigstilt) {
      return HttpResponse.json({ utsendingsinfo: null })
    }

    return HttpResponse.json({
      datoEkspedert: new Date().toISOString(),
    })
  }),

  http.get<SakParams>('/api/sak/:sakId/brev', async ({ params }) => {
    const { sakId } = params
    const brev = await sakStore.hentBrevForSak(sakId)
    return HttpResponse.json({ brev })
  }),

  http.get<BrevParams>('/api/sak/:sakId/brev/:brevId', async ({ params, request }) => {
    const { brevId } = params
    const brev = await sakStore.hentBrev(brevId)
    if (request.headers.get('accept') === 'application/json') {
      return HttpResponse.json(brev)
    }

    const buffer = await hentBrevSomPdf(brev)
    return respondPdf(buffer)
  }),
]

async function hentBrevSomPdf(brev: Brev): Promise<ArrayBuffer> {
  switch (brev.brevmal) {
    case Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER:
      return lastDokument('barnebriller_innhente_opplysninger')
    case Brevmal.BARNEBRILLER_VEDTAK_INNVILGELSE:
    case Brevmal.BARNEBRILLER_VEDTAK_AVSLAG:
      return lastDokument('barnebriller_innvilgelsesbrev')
    case Brevmal.BREVEDITOR_VEDTAKSBREV:
      return lastDokument('breveditor_vedtaksbrev')
    default:
      return lastDokument('breveditor_vedtaksbrev')
  }
}
