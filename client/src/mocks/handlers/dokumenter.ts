import { delay, http, HttpResponse } from 'msw'

import type { JournalføringRequest, OpprettetSakResponse } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import kvittering from '../data/brillekvittering.pdf'
import brilleseddel from '../data/brilleseddel.pdf'
import kvitteringsside from '../data/kvitteringsside.pdf'
import pdfSoknad from '../data/manuellBrilleSoknad.pdf'
import { respondForbidden, respondInternalServerError, respondNoContent, respondNotFound, respondPdf } from './response'

interface JournalpostParams {
  journalpostId: string
}

interface DokumentParams extends JournalpostParams {
  dokumentId: string
}

export const dokumentHandlers: StoreHandlersFactory = ({ journalpostStore, barnebrillesakStore }) => [
  http.get<JournalpostParams>(`/api/journalpost/:journalpostId`, async ({ params }) => {
    const journalpostId = params.journalpostId
    const journalpost = await journalpostStore.hent(journalpostId)

    await delay(200)
    if (journalpost) {
      return HttpResponse.json(journalpost)
    } else if (journalpostId === '403') {
      return respondForbidden()
    } else if (journalpostId === '500') {
      return respondInternalServerError()
    } else {
      return respondNotFound()
    }
  }),

  http.get<DokumentParams>(`/api/journalpost/:journalpostId/:dokumentId`, async ({ params }) => {
    const dokumentId = params.dokumentId

    let dokument
    switch (dokumentId) {
      case '2345':
        dokument = kvittering
        break
      case '3456':
        dokument = brilleseddel
        break
      case '4567':
        dokument = kvitteringsside
        break
      case '1234':
      default:
        dokument = pdfSoknad
        break
    }

    const buffer = await fetch(dokument).then((res) => res.arrayBuffer())
    await delay(500)
    return respondPdf(buffer)
  }),

  http.post<JournalpostParams, JournalføringRequest, OpprettetSakResponse>(
    `/api/journalpost/:journalpostId/journalforing`,
    async ({ request }) => {
      const journalføring = await request.json()

      const eksisternedeSakId = journalføring.sakId
      const tittel = journalføring.tittel

      await journalpostStore.journalfør(journalføring.journalpostID, tittel)
      await delay(500)

      if (eksisternedeSakId) {
        await barnebrillesakStore.knyttJournalpostTilSak(journalføring)
        await barnebrillesakStore.tildel(eksisternedeSakId)
        return HttpResponse.json({ sakId: eksisternedeSakId })
      } else {
        const sakId = await barnebrillesakStore.opprettSak(journalføring)
        await barnebrillesakStore.tildel(sakId)

        return HttpResponse.json({ sakId: sakId.toString() })
      }
    }
  ),

  http.post<{ oppgaveId: string }>(`/api/oppgaver-v2/:oppgaveId/tildeling`, async ({ params }) => {
    await journalpostStore.tildel(params.oppgaveId)
    await delay(500)
    return respondNoContent()
  }),
]
