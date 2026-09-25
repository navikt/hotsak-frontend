import { http, HttpResponse } from 'msw'

import {
  type Brev,
  Brevmal,
  type FerdigstillBrevutkastRequest,
  type LeggTilMottakerRequest,
  type OppdaterBrevutkastRequest,
  type OpprettBrevutkastRequest,
} from '../../brev/brevTyper'
import { UtfallLåst } from '../../sak/v2/behandling/behandlingTyper'
import type { StoreHandlersFactory } from '../data'
import { lastDokument } from '../data/felles'
import type { SakParams } from './params'
import { respondConflict, respondNoContent, respondPdf } from './response'

interface BrevParams extends SakParams {
  brevId: string
}

interface BrevmottakerParams extends BrevParams {
  brevmottakerId: string
}

export const brevHandlers: StoreHandlersFactory = ({ sakStore }) => [
  /**
   * Opprett brevutkast.
   */
  http.post<SakParams, OpprettBrevutkastRequest>('/api/sak/:sakId/brev', async ({ params, request }) => {
    const { sakId } = params
    const brev = await sakStore.opprettBrevutkast(sakId, await request.json())
    if (!brev) {
      return respondConflict()
    }
    return HttpResponse.json(brev)
  }),

  /**
   * Oppdater brevutkast.
   */
  http.put<BrevParams, OppdaterBrevutkastRequest>('/api/sak/:sakId/brev/:brevId', async ({ params, request }) => {
    const { brevId } = params
    const brev = await sakStore.oppdaterBrevutkast(brevId, await request.json())
    if (!brev) {
      return respondConflict()
    }
    return HttpResponse.json(brev)
  }),

  /**
   * Slett brevutkast.
   */
  http.delete<BrevParams>('/api/sak/:sakId/brev/:brevId', async ({ params }) => {
    const { brevId } = params
    const slettet = await sakStore.slettBrevutkast(brevId)
    if (!slettet) {
      return respondConflict()
    }
    return respondNoContent()
  }),

  /**
   * Ferdigstill brevutkast.
   */
  http.post<BrevParams, FerdigstillBrevutkastRequest>(
    '/api/sak/:sakId/brev/:brevId/ferdigstilling',
    async ({ params }) => {
      const { brevId } = params
      const brev = await sakStore.ferdigstillBrevutkast(brevId)
      if (!brev) {
        return respondConflict()
      }
      return respondNoContent()
    }
  ),

  /**
   * Rediger brevutkast.
   */
  http.delete<BrevParams>('/api/sak/:sakId/brev/:brevId/ferdigstilling', async ({ params }) => {
    const { brevId } = params
    const brev = await sakStore.redigerBrevutkast(brevId)
    if (!brev) {
      return respondConflict()
    }
    return respondNoContent()
  }),

  /**
   * Send underveis brev.
   */
  http.post<BrevParams>('/api/sak/:sakId/brev/:brevId/utsending', async ({ params }) => {
    const { brevId } = params
    const brev = await sakStore.sendUnderveisBrev(brevId)
    if (!brev) {
      return respondConflict()
    }
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

    const useGotenberg = import.meta.env.VITE_GOTENBERG === 'true'
    if (useGotenberg && typeof brev.data.valueAsHtml === 'string') {
      const htmlBlob = new Blob([brev.data.valueAsHtml], { type: 'text/html' })
      const formData = new FormData()
      formData.append('files', htmlBlob, 'index.html')
      const response = await fetch('/gotenberg/forms/chromium/convert/html', {
        method: 'POST',
        body: formData,
      })
      const buffer = await response.arrayBuffer()
      return respondPdf(buffer)
    }

    const buffer = await hentBrevSomPdf(brev)
    return respondPdf(buffer)
  }),

  http.get<BrevParams>('/api/sak/:sakId/brev/:brevId/mottakere', async ({ params }) => {
    const { brevId } = params
    const mottakere = await sakStore.hentBrevmottakere(brevId)
    return HttpResponse.json({ brevmottakere: mottakere })
  }),

  http.post<BrevParams, LeggTilMottakerRequest>(
    '/api/sak/:sakId/brev/:brevId/mottakere',
    async ({ params, request }) => {
      const { sakId, brevId } = params
      await sakStore.leggTilBrevmottaker(sakId, brevId, await request.json())
      return respondNoContent()
    }
  ),

  http.delete<BrevmottakerParams>('/api/sak/:sakId/brev/:brevId/mottakere/:brevmottakerId', async ({ params }) => {
    const { sakId, brevId, brevmottakerId } = params
    await sakStore.slettBrevmottaker(sakId, brevId, brevmottakerId)
    return respondNoContent()
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
